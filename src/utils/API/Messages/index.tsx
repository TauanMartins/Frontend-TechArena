export default API => (resource: string) => {
  return {
    select_messages(parameters: { idToken: string, chat_id: number, cursor?: string }) {

      if (parameters.cursor) {
        return API.get(resource + '?idToken=' + parameters.idToken + '&chat_id=' + parameters.chat_id + '&cursor=' + parameters.cursor).catch(error => { throw new Error(error.response.data.message) });
      }
      else {
        return API.get(resource + '?idToken=' + parameters.idToken + '&chat_id=' + parameters.chat_id).catch(error => { throw new Error(error.response.data.message) });
      }


    },
    create_message(parameters: object) {
      return API.post(resource, parameters).catch(error => { throw new Error(error.response.data.message) });
    },
  };
};
