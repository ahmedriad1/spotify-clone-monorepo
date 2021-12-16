import { gql } from '@spotify-clone-monorepo/utils';
import { axiosGql } from '../axios';

interface ILoginResponse {
  loginUser: {
    name: string;
    email: string;
    token: string;
    refreshToken: string;
  };
}

interface ILoginData {
  email: string;
  password: string;
}

export const loginMutation = (data: ILoginData) =>
  axiosGql<ILoginResponse>(
    gql`
      mutation loginUser($email: String!, $password: String!) {
        loginUser(data: { email: $email, password: $password }) {
          name
          email
          token
          refreshToken
        }
      }
    `,
    data
  );
