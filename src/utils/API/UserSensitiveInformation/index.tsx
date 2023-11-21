import {Tokens} from '../../Model/Token';

export default API => (resource: string) => {
  return {
    user_sensitive_info(accessToken: Tokens['accessToken']) {
      return API.get(resource + '?personFields=birthdays,genders', {
        headers: {Authorization: 'Bearer ' + accessToken},
      }).catch(error => { throw new Error(error.response.data.message) });
    },
  };
};
