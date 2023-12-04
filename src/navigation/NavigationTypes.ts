export type RootStackParamList = {
  // Páginas seguem hierarquia:
  // 1 - Stack que agrupa todas as possíveis opções de telas a serem mostradas neste menu.
  // 2 - Página inicial do menu, normalmente mostra vários botões que levam para outras páginas.
  // 3 - Página opcional, mostrará opções de uma aba anterior e levará para um menu mais específico.
  // 4 - Página final.
  /* ------------------------------------------------------------------------------------------------*/

  Login: undefined,

  /* ------------------------------------------------------------------------------------------------*/

  HomeStack: undefined,
  Home: undefined,
  HomeAppointments: { sport_id?: number },

  /* ------------------------------------------------------------------------------------------------*/

  LeagueStack: { page?: string, arena_id?: number },
  Ligas: { page?: string, arena_id?: number },
  LeagueMapStack: undefined,
  LeagueMap: { arena_id?: number },
  LeagueHomeStack: undefined,
  LeagueHome: { arena: object },
  LeaguePersonalStack: undefined,
  LeaguePersonal: undefined,
  /* ------------------------------------------------------------------------------------------------*/

  CreateMatchStack: { page?: string, arena_id?: number },
  Agendamentos: { page?: string, arena_id?: number },
  CreateMatchMapStack: undefined,
  CreateMatchMap: { arena_id?: number },
  CreateMatchHomeStack: undefined,
  CreateMatchHome: { arena: object },
  CreateMatchPersonalStack: undefined,
  CreateMatchPersonal: undefined,

  /* ------------------------------------------------------------------------------------------------*/

  SettingsStack: undefined,
  Settings: undefined,
  SettingsPreferencesStack: undefined,
  SettingsPreferences: undefined,
  SettingsThemePreferences: undefined,

  /* ------------------------------------------------------------------------------------------------*/


  SocialStack: undefined,
  Social: undefined,
  SocialChatStack: { chat_id: number, name: string, image: string, is_group_chat?: boolean },
  SocialChat: undefined,
  SocialUserChatDetail: { chat_id: number, name: string, image: string, is_group_chat?: boolean },
};
