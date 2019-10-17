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
  itemsConnection: forwardTo('db')
};

module.exports = Query;
