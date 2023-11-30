import { User } from "../../Model/User";

export default API => (resource: string) => {
  return {
    select_appointments(parameters: { lat: string, longitude: string, username: User['username'], preferSports?: boolean, orderByTime: string, distance: string, page?: number }) {
      if (parameters.preferSports) {
        return API.get(resource + '?lat=' + parameters.lat + '&longitude=' + parameters.longitude + '&username=' + parameters.username + '&preferSports=' + parameters.preferSports + '&orderByTime=' + parameters.orderByTime + '&distance=' + parameters.distance + '&page=' + parameters.page).catch(error => { throw new Error(error.response.data.message) });
      } else {
        return API.get(resource + '?lat=' + parameters.lat + '&longitude=' + parameters.longitude + '&username=' + parameters.username + '&orderByTime=' + parameters.orderByTime + '&distance=' + parameters.distance + '&page=' + parameters.page).catch(error => { throw new Error(error.response.data.message) });
      }
    },
    create_appointments(parameters: { sport_id: number, arena_id: number, date: string, schedule_id: number, username: User['username'], holder: boolean }) {
      return API.post(resource, parameters).catch(error => { throw new Error(error.response.data.message) });
    },
    select_user_appointments(parameters: { lat: string, longitude: string, username: User['username'], preferSports?: boolean, orderByTime: string, distance: string, page?: number }) {
      if (parameters.preferSports) {
        return API.get(resource + '?lat=' + parameters.lat + '&longitude=' + parameters.longitude + '&username=' + parameters.username + '&preferSports=' + parameters.preferSports + '&orderByTime=' + parameters.orderByTime + '&distance=' + parameters.distance + '&page=' + parameters.page).catch(error => { throw new Error(error.response.data.message) });
      } else {
        return API.get(resource + '?lat=' + parameters.lat + '&longitude=' + parameters.longitude + '&username=' + parameters.username + '&orderByTime=' + parameters.orderByTime + '&distance=' + parameters.distance + '&page=' + parameters.page).catch(error => { throw new Error(error.response.data.message) });
      }
    },
  };
};
