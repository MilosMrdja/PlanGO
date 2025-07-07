export interface AuthResponse {
  status: string;
  data: {
    email: string;
    accessToken: string;
    tokenValidityMins: number;
  };
}

export interface AuthError {
  message: string;
  [key: string]: any;
}
