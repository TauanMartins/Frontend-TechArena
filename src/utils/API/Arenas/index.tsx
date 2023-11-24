import { User } from "../../Model/User";

export default API => (resource: string) => {
  return {
    select_arenas(parameters: { lat: string, longitude: number, username?: User['username'] }) {
      if (parameters.username) {
        return API.get(resource + '?lat=' + parameters.lat + '&longitude=' + parameters.longitude + '&username=' + parameters.username).catch(error => { throw new Error(error.response.data.message) });
      } else {
        return API.get(resource + '?lat=' + parameters.lat + '&longitude=' + parameters.longitude).catch(error => { throw new Error(error.response.data.message) });
      }
    },
  };
};
