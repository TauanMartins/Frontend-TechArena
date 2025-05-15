export default API => (resource: string) => {
  return {
    select_teams(parameters: { search: string }) {
      return API.get(resource + '?search=' + parameters.search).catch(error => { throw new Error(error.response.data.message) });
    },
    create_team(parameters: object) {
      return API.post(resource, parameters, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).catch(error => { throw new Error(error.response) });
    },
    edit_team(parameters: object) {
      return API.put(resource, parameters).catch(error => { throw new Error(error.response) });
    },
    check_existing_name_teams(parameters: { name: string }) {
      return API.get(resource + '?name=' + parameters.name).catch(error => { throw new Error(error.response.data.message) });
    },
    request_member(parameters: object) {
      return API.post(resource, parameters).catch(error => { throw new Error(error.response.data.message) });;
    },
    accept_member(parameters: object) {
      return API.put(resource, parameters).catch(error => { throw new Error(error.response.data.message) });;
    },
  };
};
