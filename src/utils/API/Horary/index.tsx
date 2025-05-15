
export default API => (resource: string) => {
  return {
    select_available_horary(parameters: { arena_id: number, sport_id: number, date: string }) {
      return API.get(resource + '?sport_id=' + parameters.sport_id + '&arena_id=' + parameters.arena_id + '&date=' + parameters.date).catch(error => { throw new Error(error.response.data.message) });
    },
  };
};
