export interface UserDecoded {
  idToken: string;
  serverAuthCode: string;
  user: object;
}

export interface Tokens {
  idToken: string;
  accessToken: string;
}
