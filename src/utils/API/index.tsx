import axios from 'axios';
import Users from './Users';
import UserSensitiveInformation from './UserSensitiveInformation';

const API = axios.create({
  baseURL: 'https://api.techarena.com.br/api',
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
});

const API_2 = axios.create({
  baseURL: 'https://people.googleapis.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

const $users = Users(API)('/users');
const $users_prefered_theme = Users(API)('/users/theme');
const $users_sensitive_information =
  UserSensitiveInformation(API_2)('/people/me');

export default {
  $users,
  $users_prefered_theme,
  $users_sensitive_information,
};
