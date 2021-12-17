import { withAuth } from '@spotify-clone-monorepo/auth';
import {
  createPaginatedLoader,
  searchUsers,
  useAddArtist,
} from '@spotify-clone-monorepo/data-admin';
import {
  Button,
  Form,
  Input,
  SelectAutocomplete,
} from '@spotify-clone-monorepo/ui';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import Layout from '../../components/Layout';

const AddArtists = () => {
  const router = useRouter();
  const mutation = useAddArtist();

  const schema = yup.object().shape({
    name: yup.string().required(),
    user: yup.object({
      value: yup.string().required(),
      label: yup.string().required(),
    }),
  });

  const handleSubmit = async (input) => {
    const { name, user } = input;
    await mutation.mutateAsync({ name, user: { id: user.value } });
    router.push('/artists');
  };

  return (
    <Layout title="Add Artists">
      <h2 className="mb-8">Add Artists</h2>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <Form onSubmit={handleSubmit} schema={schema}>
          <div className="py-5 space-y-6 sm:py-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white"
                >
                  Name
                </label>

                <Input name="name" type="text" placeholder="Artist Name" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="user"
                  className="block text-sm font-medium text-white"
                >
                  User
                </label>

                <SelectAutocomplete
                  loadOptions={createPaginatedLoader(searchUsers, {
                    total: 'totalUsers',
                    all: 'users',
                    mapOptions: (user: any) => ({
                      label: user.email,
                      value: user.id,
                    }),
                  })}
                  name="user"
                />
              </div>
            </div>
          </div>

          <div className="my-2">
            <Button loading={mutation.isLoading}>Add</Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default withAuth(AddArtists);
