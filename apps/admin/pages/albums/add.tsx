import * as yup from 'yup';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { Form, Input, Button } from '@spotify-clone-monorepo/ui';
import { withAuth } from '@spotify-clone-monorepo/auth';
import {
  useAddAlbum,
  IAddAlbumData,
  searchArtists,
  searchGenres,
} from '@spotify-clone-monorepo/data-admin';
import { PhotographIcon } from '@heroicons/react/outline';

const AddAlbums = () => {
  const router = useRouter();
  const { completed, ...mutation } = useAddAlbum();

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
    genre: yup
      .object({
        value: yup.string().required(),
        label: yup.string().required(),
      })
      .required(),
    type: yup
      .object({
        value: yup.string().oneOf(['ALBUM', 'SINGLE']).required(),
        label: yup.string().required(),
      })
      .required(),
    image: yup
      .mixed()
      .required()
      .test(
        'fileFormat',
        'Image only',
        (value) => value && value[0] && value[0].type.startsWith('image/')
      ),
    artists: yup.array().default([]).min(1).required(),
  });

  const handleSubmit = async (input) => {
    const { artists, genre, image, type, ...rest } = input;

    const addData: IAddAlbumData = {
      ...rest,
      artists: artists.map((a) => ({ id: a.value })),
      genre: { id: genre.value },
      image: image[0],
      type: type.value,
    };

    await mutation.mutateAsync(addData);
    router.push('/albums');
  };

  return (
    <Layout title="Add Albums">
      <h2 className="mb-8">Add Albums</h2>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <Form
          onSubmit={handleSubmit}
          schema={schema}
          defaultValues={{
            artists: [],
            type: 'ALBUM',
          }}
        >
          <div className="py-5 space-y-6 sm:py-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white"
                >
                  Name
                </label>

                <Input name="name" type="text" placeholder="Album Name" />
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
                  placeholder="Album Description"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2 relative">
                <label
                  htmlFor="artists"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Artists
                </label>

                <FormMultiselectAutoComplete
                  loadOptions={createPaginatedLoader(searchArtists, {
                    total: 'totalArtists',
                    all: 'artists',
                  })}
                  name="artists"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  className="block text-sm font-medium text-white"
                  htmlFor="image"
                >
                  Image
                </label>

                <FormFileUpload
                  name="image"
                  label="Upload an image"
                  icon={
                    <PhotographIcon className="mx-auto h-12 w-12 text-gray-400" />
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Genre
                </label>
                <FormSelectAutoComplete
                  name="genre"
                  loadOptions={createPaginatedLoader(searchGenres, {
                    total: 'totalGenres',
                    all: 'genres',
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Album Type
                </label>
                <FormSelect
                  name="type"
                  options={[
                    { label: 'Album', value: 'ALBUM' },
                    { label: 'Single', value: 'SINGLE' },
                  ]}
                />
              </div>
            </div>

            {completed !== null && (
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <ProgressBar progress={completed} />
                </div>
              </div>
            )}
          </div>

          <div className="my-2">
            <Button loading={mutation.isLoading}>Add</Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default withAuth(AddAlbums);
