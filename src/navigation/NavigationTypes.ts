export type RootStackParamList = {
  // Páginas seguem hierarquia:
  // 1 - Stack que agrupa todas as possíveis opções de telas a serem mostradas neste menu.
  // 2 - Página inicial do menu, normalmente mostra vários botões que levam para outras páginas.
  // 3 - Página opcional, mostrará opções de uma aba anterior e levará para um menu mais específico.
  // 4 - Página final.
  /* ------------------------------------------------------------------------------------------------*/

  Login: undefined;

  /* ------------------------------------------------------------------------------------------------*/

  HomeStack: undefined,
  Home: undefined,
  HomeRecommendedSchedules: undefined,
  /* ------------------------------------------------------------------------------------------------*/

  SettingsStack: undefined;
  Settings: undefined;
  SettingsPreferencesStack: undefined;
  SettingsPreferences: undefined;
  SettingsThemePreferences: undefined;
};
