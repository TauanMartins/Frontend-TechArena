export default API => (resource: string) => {
  return {
    request_friend(parameters: object) {
      return API.post(resource, parameters);
    },
    list_friends(parameters: {username: string}){
      return API.get(resource+'?username='+parameters.username);
    },
    accept_friend(parameters: object) {
      return API.put(resource, parameters);
    },
  };
};
