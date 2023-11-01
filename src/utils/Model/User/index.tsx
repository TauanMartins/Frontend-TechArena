export interface User {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  locale: string;
  name: string;
  picture: string;
  sub: string;
  permission: string;
  gender: string;
  dt_birth: string;
  prefered_theme: null | 'light' | 'dark'
}

export const UnauthenticatedUser: User = {
  aud: '',
  azp: '',
  email: '',
  email_verified: false,
  exp: 0,
  family_name: '',
  given_name: '',
  iat: 0,
  iss: '',
  locale: '',
  name: '',
  picture: '',
  sub: '',
  permission: 'G',
  gender: '',
  dt_birth: '',
  prefered_theme: null
};
