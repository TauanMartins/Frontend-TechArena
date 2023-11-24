export default API => (resource: string) => {
  return {
    user_info(parameters: object) {
      return API.post(resource, parameters).catch(error => { throw new Error(error.response.data.message) });
    },
    user_prefered_theme(parameters: object) {
      return API.put(resource, parameters).catch(error => { throw new Error(error.response.data.message) });
    },
    select_users(parameters: { search: string }) {
      return API.get(resource + '?search=' + parameters.search).catch(error => { throw new Error(error.response.data.message) });
    },
    select_user_teams(parameters: { idToken: string }) {
      return API.get(resource + '?idToken=' + parameters.idToken).catch(error => { throw new Error(error.response.data.message) });
    },
    request_team(parameters: object) {
      return API.post(resource, parameters).catch(error => { throw new Error(error.response.data.message) });
    },
    request(parameters: object) {
      return API.post(resource, parameters).catch(error => { throw new Error(error.response.data.message) });
    },
    accept_team(parameters: object) {
      return API.put(resource, parameters).catch(error => { throw new Error(error.response.data.message) });
    },
  };
};
