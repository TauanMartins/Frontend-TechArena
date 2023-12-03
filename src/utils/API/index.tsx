import axios from 'axios';
import Users from './Users';
import UserSensitiveInformation from './UserSensitiveInformation';
import Chats from './Chats';
import Messages from './Messages';
import Friends from './Friends';
import Teams from './Teams';
import Sports from './Sports';
import Appointments from './Appointments';
import Arenas from './Arenas';
import Horary from './Horary';
import SportsArena from './SportsArena';

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
const $users_appointments = Users(API)('/users/appointments');
const $users_prefered_theme = Users(API)('/users/theme');
const $users_sensitive_information = UserSensitiveInformation(API_2)('/people/me');
const $chat = Chats(API)('/chat');
const $chat_group_detail = Chats(API)('/chat/group/detail');
const $chat_user_detail = Chats(API)('/chat/private/detail');
const $chat_team = Chats(API)('/chat/team');
const $chat_appointment = Chats(API)('/chat/appointment');
const $messages = Messages(API)('/message');
const $friends = Friends(API)('/friend');
const $teams = Teams(API)('/team');
const $teams_owner = Teams(API)('/team/user');
const $teamsCheck = Teams(API)('/team/exist');
const $sports = Sports(API)('/sports');
const $sport_arena = SportsArena(API)('/sports/arena');
const $sports_material = Sports(API)('/sports/material');
const $sports_prefered = Sports(API)('/sports/prefered-sports');
const $appointments = Appointments(API)('/appointments');
const $user_appointments = Appointments(API)('/appointments/user');
const $arenas = Arenas(API)('/arenas');
const $arenas_sport = Arenas(API)('/arenas/sports');
const $arenas_user = Arenas(API)('/arenas/users');
const $horary = Horary(API)('/horary');

export default {
  $users,
  $users_team,
  $users_prefered_theme,
  $users_appointments,
  $users_sensitive_information,
  $chat,
  $chat_team,
  $chat_appointment,
  $messages,
  $friends,
  $teams,
  $teamsCheck,
  $chat_user_detail,
  $chat_group_detail,
  $teams_owner,
  $sports,
  $sports_prefered,
  $appointments,
  $sports_material,
  $arenas,
  $arenas_sport,
  $arenas_user,
  $horary,
  $user_appointments,
  $sport_arena
};
