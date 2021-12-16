export interface IUser {
  name: string;
  email: string;
}

export interface IAuthenticatedResponse {
  user: IUser;
  token: string;
  refresh_token: string;
}

// export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
