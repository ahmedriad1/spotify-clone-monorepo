import { axiosGql } from '../axios';
import { gql } from '@spotify-clone-monorepo/utils';

interface IRefreshTokenResponse {
  refreshAccessToken: {
    id: string;
    name: string;
    email: string;
    token: string;
  };
}

export const refreshTokenMutation = async (refreshToken: string) => {
  const { refreshAccessToken } = await axiosGql<IRefreshTokenResponse>(
    gql`
      mutation refreshAccessToken($token: String!) {
        refreshAccessToken(data: { refreshToken: $token }) {
          id
          name
          email
          token
        }
      }
    `,
    { token: refreshToken }
  );

  return refreshAccessToken;
};
