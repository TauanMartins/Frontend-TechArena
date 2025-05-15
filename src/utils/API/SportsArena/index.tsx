export default API => (resource: string) => {
  return {
    select_sports_arena(parameters: { arena_id: number }) {
      return API.get(resource + '?arena_id=' + parameters.arena_id).catch(error => { throw new Error(error.response.data.message) });
    },
  };
};
