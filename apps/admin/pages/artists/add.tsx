import * as yup from 'yup';
import Layout from '@/components/Layout';
import Form from '@/components/Form';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import FormInput from '@/components/Form/FormInput';
import withAuth from '@/helpers/withAuth';
import { createPaginatedLoader } from '@/helpers/functions';
import searchUsers, { ISelectUser } from '@/queries/users/searchUsers';
import useAddArtist from '@/mutations/artists/useAddArtist';
import FormSelectAutoComplete from '@/components/Form/FormSelectAutocomplete';

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

  const handleSubmit = async input => {
    const { name, user } = input;
    await mutation.mutateAsync({ name, user: { id: user.value } });
    router.push('/artists');
  };

  return (
    <Layout title='Add Artists'>
      <h2 className='mb-8'>Add Artists</h2>
      <div className='mt-5 md:mt-0 md:col-span-2'>
        <Form onSubmit={handleSubmit} schema={schema}>
          <div className='py-5 space-y-6 sm:py-6'>
            <div className='grid grid-cols-3 gap-6'>
              <div className='col-span-3 sm:col-span-2'>
                <label htmlFor='name' className='block text-sm font-medium text-white'>
                  Name
                </label>

                <FormInput name='name' type='text' placeholder='Artist Name' />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-6'>
              <div className='col-span-3 sm:col-span-2'>
                <label htmlFor='user' className='block text-sm font-medium text-white'>
                  User
                </label>

                <FormSelectAutoComplete
                  loadOptions={createPaginatedLoader(searchUsers, {
                    total: 'totalUsers',
                    all: 'users',
                    mapOptions: (user: ISelectUser) => ({
                      label: user.email,
                      value: user.id,
                    }),
                  })}
                  name='user'
                />
              </div>
            </div>
          </div>

          <div className='my-2'>
            <Button loading={mutation.isLoading}>Add</Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default withAuth(AddArtists);
