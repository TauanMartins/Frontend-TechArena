export default API => (resource: string) => {
  return {
    select_sports(parameters) {
      return API.get(resource).catch(error => { throw new Error(error.response.data.message) });
    },
    select_prefered_sports(parameters: { username: string }) {
      return API.get(resource + '?username=' + parameters.username).catch(error => { throw new Error(error.response.data.message) });
    },
    create_prefered_sports(parameters: object) {
      return API.post(resource, parameters).catch(error => { throw new Error(error.response.data.message) });
    },
    update_prefered_sports(parameters: object) {
      return API.put(resource, parameters).catch(error => { throw new Error(error.response.data.message) });
    },
  };
};
