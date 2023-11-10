export default API => (resource: string) => {
  return {
    select_chats(parameters: { idToken: string }) {
      return API.get(resource + '?idToken=' + parameters.idToken);
    },
    post_chats(parameters: object) {
      return API.post(resource, parameters);
    },
  };
};
