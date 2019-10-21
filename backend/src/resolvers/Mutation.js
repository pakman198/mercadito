const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const tokenGeneration = (context, userId) => {
  const token = jwt.sign({ userId }, process.env.APP_SECRET);

  return context.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365
  });
}

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO check if login
    const item = await ctx.db.mutation.createItem({ 
      data: { ...args}
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
    const item = await ctx.db.query.item({ where }, `{ id title}`)
    // 2. TODO check ownership
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
    console.log('ctx.response', ctx.resopnse);
    ctx.response.clearCookie('token');
    return {
      message: 'Signed out successfully'
    }
  }
};

module.exports = Mutations;
