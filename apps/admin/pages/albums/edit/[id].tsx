import * as yup from 'yup';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import {
  searchArtists,
  searchGenres,
  useAlbum,
  useUpdateAlbum,
  IUpdateAlbumData,
  createPaginatedLoader,
} from '@spotify-clone-monorepo/data-admin';
import {
  Button,
  FileUpload,
  Form,
  Input,
  MultiselectAutocomplete,
  SelectAutocomplete,
} from '@spotify-clone-monorepo/ui';
import { withAuth } from '@spotify-clone-monorepo/auth';
import { PhotographIcon } from '@heroicons/react/outline';

const EditAlbums = () => {
  const router = useRouter();
  const { data, isLoading } = useAlbum(router.query.id as string);
  const mutation = useUpdateAlbum();

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
    genre: yup.object({
      value: yup.string().required(),
      label: yup.string().required(),
    }),
    image: yup.mixed().test('fileFormat', 'Image only', (value) => {
      if (!value) return true;
      return value[0].type.startsWith('image/');
    }),
    artists: yup.array().min(1).optional(),
  });

  const handleSubmit = async (input) => {
    const { artists, genre, image, ...rest } = input;

    const updateData: IUpdateAlbumData = {
      ...rest,
      id: data.id,
      genre: { id: genre.value },
    };

    if (artists) updateData.artists = artists.map((a) => ({ id: a.value }));
    if (image) updateData.image = image[0];

    await mutation.mutateAsync(updateData);

    router.push('/albums');
  };

  if (isLoading) return <Layout title="Edit Album">Loading...</Layout>;

  return (
    <Layout title="Edit Album">
      <h2 className="text-4xl mb-8">Edit Album</h2>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <Form
          onSubmit={handleSubmit}
          schema={schema}
          defaultValues={{
            name: data.name,
            description: data.description,
            genre: { value: data.genre.id, label: data.genre.name },
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

                <MultiselectAutocomplete
                  name="artists"
                  loadOptions={createPaginatedLoader(searchArtists, {
                    total: 'totalArtists',
                    all: 'artists',
                  })}
                  defaultValues={data.artists.map((a) => ({
                    value: a.id,
                    label: a.name,
                  }))}
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

                <FileUpload
                  name="image"
                  label="Upload an image"
                  icon={
                    <PhotographIcon className="mx-auto h-12 w-12 text-gray-400" />
                  }
                  defaultValue={data.imageUrl}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  className="block text-sm font-medium text-white"
                  htmlFor="genre"
                >
                  Genre
                </label>
                <SelectAutocomplete
                  name="genre"
                  loadOptions={createPaginatedLoader(searchGenres, {
                    total: 'totalGenres',
                    all: 'genres',
                  })}
                  defaultValue={{
                    value: data.genre.id,
                    label: data.genre.name,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="my-2">
            <Button loading={mutation.isLoading}>Update</Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default withAuth(EditAlbums);
