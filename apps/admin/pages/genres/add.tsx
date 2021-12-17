import { withAuth } from '@spotify-clone-monorepo/auth';
import { useAddGenre } from '@spotify-clone-monorepo/data-admin';
import { Button, Form, Input } from '@spotify-clone-monorepo/ui';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import Layout from '../../components/Layout';

const AddGenres = () => {
  const router = useRouter();
  const mutation = useAddGenre();

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
  });

  const handleSubmit = async (data) => {
    await mutation.mutateAsync(data);
    router.push('/genres');
  };

  return (
    <Layout title="Add Genres">
      <h2 className="text-4xl mb-8">Add Genres</h2>
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

                <Input name="name" type="text" placeholder="Genres Name" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-white"
                >
                  Description
                </label>

                <Input
                  name="description"
                  type="text"
                  placeholder="Genre Description"
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

export default withAuth(AddGenres);
