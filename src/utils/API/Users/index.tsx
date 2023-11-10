export default API => (resource: string) => {
  return {
    user_info(parameters: object) {
      return API.post(resource, parameters);
    },
    user_prefered_theme(parameters: object) {
      return API.put(resource, parameters);
    },
    select_users(parameters: { search: string }) {
      return API.get(resource + '?search=' + parameters.search);
    }
  };
};
