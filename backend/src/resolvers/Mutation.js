const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO check if login
    const item = await ctx.db.mutation.createItem({ 
      data: { ...args}
    }, info);

    return item;
  }
};

module.exports = Mutations;
