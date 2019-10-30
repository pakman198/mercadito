const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  // db is the context we defined when we created the server (createServer.js)
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  
  me(parent, args, ctx, info) {
    if(!ctx.request.userId) {
      return null;
    }

    return ctx.db.query.user({
      where: { 
        id: ctx.request.userId 
      }
    }, info)
  },
  
  async users(parent, args, ctx, info) {
    if(!ctx.request.userId) {
      throw new Error('You must be logged in')
    }

    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSION_UPDATE'])

    return ctx.db.query.users({}, info);
  },

  async order(parent, args, ctx, info) {
    const { userId } = ctx.request;
    
    if(!userId) {
      throw new Error('You must be logged in')
    }

    const order = await ctx.db.query.order({
      where: { id: args.id }
    }, info);
    const owner = order.user.id === userId;
    const hasOrderPermissions = ctx.request.user.permissions.includes('ADMIN');

    if(!owner || !hasOrderPermissions) {
      throw new Error("You don't have the right privileges to access this page")
    }

    return order;
  }
};

module.exports = Query;
