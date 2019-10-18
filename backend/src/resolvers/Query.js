const { forwardTo } = require('prisma-binding');

const Query = {
  // async items(parent, args, ctx, info) {
  //   // TODO check if login
  //   const items =  await ctx.db.query.items();

  //   return items;
  // }

  // db is the context we defined when we created the server (createServer.js)
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    console.log('userId', ctx.request.userId)
    if(!ctx.request.userId) {
      return null;
    }

    return ctx.db.query.user({
      where: { 
        id: ctx.request.userId 
      }
    }, info)
  }
};

module.exports = Query;
