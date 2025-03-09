export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  accessToken?: string;
  refreshtoken?: string;
}
