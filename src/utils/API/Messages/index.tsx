export default API => (resource: string) => {
  return {
    select_messages(parameters: { idToken: string, chat_id: number }) {
      return API.get(resource + '?idToken=' + parameters.idToken + '&chat_id=' + parameters.chat_id);
    },
    create_message(parameters: object) {
      return API.post(resource, parameters);
    },
  };
};
