export default API => (resource: string) => {
  return {
    request_friend(parameters: object) {
      return API.post(resource, parameters).catch(error => { throw new Error(error.response.data.message) });;
    },
    list_friends(parameters: {username: string}){
      return API.get(resource+'?username='+parameters.username).catch(error => { throw new Error(error.response.data.message) });;
    },
    accept_friend(parameters: object) {
      return API.put(resource, parameters).catch(error => { throw new Error(error.response.data.message) });;
    },
  };
};
