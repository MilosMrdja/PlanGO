export interface AuthResponse {
  status: string;
  data: {
    email: string;
    accessToken: string;
    tokenValidityMins: number;
  };
}
