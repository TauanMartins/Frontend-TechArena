import axios from 'axios';
import Users from './Users';
import UserSensitiveInformation from './UserSensitiveInformation';
import Chats from './Chats';
import Messages from './Messages';
import Friends from './Friends';
import Teams from './Teams';

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
const $users_team = Users(API)('/users/team');
const $users_prefered_theme = Users(API)('/users/theme');
const $users_sensitive_information =  UserSensitiveInformation(API_2)('/people/me');
const $chat =  Chats(API)('/chat');
const $chat_group_detail =  Chats(API)('/chat/group/detail');
const $chat_user_detail =  Chats(API)('/chat/private/detail');
const $chat_team =  Chats(API)('/chat/team');
const $messages =  Messages(API)('/message');
const $friends =  Friends(API)('/friend');
const $teams =  Teams(API)('/team');
const $teams_owner =  Teams(API)('/team/user');
const $teamsCheck =  Teams(API)('/team/exist');

export default {
  $users,
  $users_team,
  $users_prefered_theme,
  $users_sensitive_information,
  $chat,
  $chat_team,
  $messages,
  $friends,
  $teams,
  $teamsCheck,
  $chat_user_detail,
  $chat_group_detail,
  $teams_owner

};
