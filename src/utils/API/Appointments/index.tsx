import { User } from "../../Model/User";

export default API => (resource: string) => {
  return {
    select_appointments(parameters: { lat: string, longitude: string, username: User['username'], filter?: boolean }) {
      if (parameters.filter) {
        return API.get(resource + '?lat=' + parameters.lat + '&longitude=' + parameters.longitude + '&username=' + parameters.username+ '&filter=' + parameters.filter).catch(error => { throw new Error(error.response.data.message) });
      } else {
        return API.get(resource + '?lat=' + parameters.lat + '&longitude=' + parameters.longitude+ '&username=' + parameters.username).catch(error => { throw new Error(error.response.data.message) });
      }
    },
    create_appointments(parameters: { sport_id: number, arena_id: number, date: string, schedule_id: number, username: User['username'] }) {
      return API.post(resource, parameters).catch(error => { throw new Error(error.response.data.message) });
    },
  };
};
