import { gql } from '@spotify-clone-monorepo/utils';
import { axiosGql } from '../axios';

interface IRegisterResponse {
  createUser: {
    name: string;
    email: string;
    token: string;
    refreshToken: string;
  };
}

interface IRegisterData {
  name: string;
  email: string;
  password: string;
}

export const registerMutation = (data: IRegisterData) =>
  axiosGql<IRegisterResponse>(
    gql`
      mutation createUser($name: String!, $email: String!, $password: String!) {
        createUser(data: { name: $name, email: $email, password: $password }) {
          name
          email
          token
          refreshToken
        }
      }
    `,
    data
  );
