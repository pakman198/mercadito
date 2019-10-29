const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeEmail } = require('../mail');
const { hasPermission } = require('../utils');
const stripe = require('../stripe');

const tokenGeneration = (context, userId) => {
  const token = jwt.sign({ userId }, process.env.APP_SECRET);

  return context.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365
  });
}

const validateUser = (userId) => {
  if(!userId) {
    throw new Error('You must be logged in to complete this operation')
  }
}

const Mutations = {
  async createItem(parent, args, ctx, info) {
    validateUser(ctx.request.userId);

    const item = await ctx.db.mutation.createItem({ 
      data: {
        // this is a db relation
        user: {
          connect: { id: ctx.request.userId }
        },
        ...args
      }
    }, info);

    return item;
  },

  updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    return ctx.db.mutation.updateItem({ 
      data: updates,
      where: { id: args.id}
    }, info);
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{ id title user { id } }`)
    
    // 2. check ownership
    const owner = item.user.id === ctx.request.userId;
    const permissions = ctx.request.user.permissions.some(
      p => ['ADMIN', 'ITEM_DELETE'].includes(p)
    );
    
    if(!owner && !permissions) {
      throw new Error("You don't have permission to complete this operation");
    }

    // 3. delete item
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER']}
      }
    }, info);

    tokenGeneration(ctx, user.id);

    return user;
  },

  async signin(parent, args, ctx, info) {
    const user = await ctx.db.query.user({
      where: {
        email: args.email,
      }
    });

    if(!user) {
      throw new Error(`No user found for email: ${args.email}`)
    }

    const valid = await bcrypt.compare(args.password, user.password);

    if(!valid) {
      throw new Error(`Invalid Password`);
    }

    tokenGeneration(ctx, user.id);

    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return {
      message: 'Signed out successfully'
    }
  },

  async requestReset(parent, args, ctx, info) {
    console.log({ args })
    // 1. Validate the user
    const user = await ctx.db.query.user({
      where: { email: args.email }
    });

    if(!user) {
      throw new Error(`No user found for email: ${args.email}`)
    }
    // 2. Set the token and expiration
    const random = promisify(randomBytes);
    const token =  (await random(20)).toString('hex');
    const tokenExpiration = Date.now() + 3600000; // 1 hour form now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: {
        resetToken: token,
        resetTokenExpiry: tokenExpiration
      }
    });

    // 3. Send the token via email
    try {
      const mailResponse = await transport.sendMail({
        from: 'no-reply@mercadito.com',
        to: user.email,
        subject: 'Your password reset token',
        html: makeEmail(`
          Your password reset token ! \n\n
          <a href="${process.env.FRONTEND_URL}/reset?resetToken=${token}">Click here to reset</a>
        `)
      });
    } catch(e) {
      throw new Error('Sorry, something went wrong. PLease try again later.');
    }
    
    return { message: 'Thanks'};
  },

  async resetPassword(parent, args, ctx, info) {
    console.log({ args })
    if(args.password !== args.confirmPassword) {
      throw new Error("Your passwords don't match");
    }
    
    // // 1. validate token and expiration
    const [ user ] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });

    if(!user) {
      throw new Error('This token is either invalid or expired');
    }

    // 2. hash password
    const password = await bcrypt.hash(args.password, 10);

    // 3. save new password and remove token expiration fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    // 4. generate JWT and set cookie
    tokenGeneration(ctx, user.id);

    return updatedUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    const { userId } = ctx.request;
    validateUser(userId);

    // The second parameter specifies the data you want from that query.
    // Seems that fields with contraints and special types are not shown in the query.
    // On signin mutation we query for user and only get back id, email, name and password 
    const user = await ctx.db.query.user(
      { where: { id: userId }},
      '{ id, email, name, permissions }', 
      info
    );

    hasPermission(user,  ['ADMIN', 'PERMISSION_UPDATE']);

    return ctx.db.mutation.updateUser({
      data: {
        permissions: { set: args.permissions }
      },
      where: { id: args.userId }
    })
  },

  async addToCart(parent, args, ctx, info) {
    const { userId } = ctx.request;
    validateUser(userId);

    const [ existingItem ] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });

    if(existingItem) {
      return ctx.db.mutation.updateCartItem({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + 1
        }
      })
    }

    return ctx.db.mutation.createCartItem({
      data: {
        user: { connect: { id: userId }},
        item: { connect: { id: args.id }}
      }
    });
  },

  async removeFromCart(parent, args, ctx, info) {
    const cartItem = await ctx.db.query.cartItem(
      { where: { id: args.id }}, 
      `{ id user { id }}`
    );

    if(!cartItem) throw new Error('No cart item found!');
    
    const { id } = cartItem.user;
    const { userId } = ctx.request;
    if(id !== userId) throw new Error("This operation can't be completed");

    return ctx.db.mutation.deleteCartItem({
      where: {
        id: args.id
      }
    }, info);
  },

  async createOrder(parent, args, ctx, info) {
    // 1. query user
    const { userId } = ctx.request;
    validateUser(userId);
    const user = await ctx.db.query.user(
      { where: { id: userId }},
      `{ 
        id
        email
        name
        cart {
          id
          quantity
          item {
            title
            price
            id
            description
            image
            largeImage
          }
        }
      }`
    );
    // 2. recalculate total
    const amount = user.cart.reduce((tally, cartItem) => {
      return tally + cartItem.item.price * cartItem.quantity
    }, 0);
    
    // 3. create stripe charge
    const charge = await stripe.charges.create({
      amount,
      currency: "USD",
      source: args.token
    }) 
    // 4. convert cartItems to orderItems
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: userId }},
      }

      delete orderItem.id;

      return orderItem;
    });
    
    // 5. create order
    const order = await ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        // the _create_ automatically adds the orderItems to the db, instead of
        // having to generate them via a mutation and then create the order 
        items: { create: orderItems },
        user: { connect: { id: userId }}
      }
    })
    
    // 6. clear cart
    const cartItems = user.cart.map(item => item.id);
    await ctx.db.mutation.deleteManyCartItems({
      where: { id_in: cartItems}
    });
    
    // 7 return order to user
    return order;
  }
};

module.exports = Mutations;
