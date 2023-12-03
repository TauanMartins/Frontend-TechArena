import { User } from "../../Model/User";

export default API => (resource: string) => {
  return {
    select_arenas_sports(parameters: { sport_id: number }) {
      return API.get(resource + '?sport_id=' + parameters.sport_id).catch(error => { throw new Error(error.response.data.message) });
    },
    select_arenas_user(parameters: { lat: string, longitude: string }) {
      return API.get(resource + '?lat=' + parameters.lat + '&longitude=' + parameters.longitude).catch(error => { throw new Error(error.response.data.message) });
    },
  };
};
