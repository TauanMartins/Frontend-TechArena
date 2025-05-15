export default API => (resource: string) => {
  return {
    select_chats(parameters: { idToken: string }) {
      return API.get(resource + '?idToken=' + parameters.idToken).catch(error => { throw new Error(error.response.data.message) });;
    },
    post_chats(parameters: object) {
      return API.post(resource, parameters).catch(error => { throw new Error(error.response.data.message) });;
    },
    post_chats_team(parameters: object) {
      return API.post(resource, parameters).catch(error => { throw new Error(error.response.data.message) });;
    },
    post_chats_appointments(parameters: object) {
      return API.post(resource, parameters).catch(error => { throw new Error(error.response.data.message) });;
    },
    detail_chat(parameters: { idToken: string, chat_id: number }) {
      return API.get(resource + '?idToken=' + parameters.idToken + '&chat_id=' + parameters.chat_id).catch(error => { throw new Error(error.response.data.message) });;
    },
  };
};
