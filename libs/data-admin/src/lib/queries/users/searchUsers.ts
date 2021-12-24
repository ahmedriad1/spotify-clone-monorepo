import { axiosGql } from '@spotify-clone-monorepo/auth';
import { gql } from '@spotify-clone-monorepo/utils';

// Interface used in the <Select /> element
export interface ISelectUser {
  id: string;
  name: string;
  email: string;
}

const searchUsers = async (q: string, page: number) => {
  const all = await axiosGql<{
    users: ISelectUser[];
    totalUsers: number;
  }>(
    gql`
      query searchUsers($q: String!, $page: Int!) {
        users(
          where: {
            name: { contains: $q, mode: insensitive }
            artist: { is: null }
          }
          page: $page
          limit: 10
        ) {
          id
          name
          email
        }

        totalUsers(
          where: {
            name: { contains: $q, mode: insensitive }
            artist: { is: null }
          }
        )
      }
    `,
    { q, page }
  );

  return all;
};

export default searchUsers;
