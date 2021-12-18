import * as yup from 'yup';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import {
  Form,
  Input,
  Button,
  MultiselectAutocomplete,
  SelectAutocomplete,
  Progress,
  FileUpload,
} from '@spotify-clone-monorepo/ui';
import { withAuth } from '@spotify-clone-monorepo/auth';
import {
  searchArtists,
  searchGenres,
  createPaginatedLoader,
  searchAlbums,
  useAddTrack,
} from '@spotify-clone-monorepo/data-admin';
import { MusicNoteIcon, XCircleIcon } from '@heroicons/react/outline';

const AddTracks = () => {
  const router = useRouter();
  const { completed, ...mutation } = useAddTrack();

  const schema = yup.object().shape({
    name: yup.string().required(),
    genre: yup
      .object({
        value: yup.string().required(),
        label: yup.string().required(),
      })
      .required(),
    album: yup
      .object({
        value: yup.string().required(),
        label: yup.string().required(),
      })
      .required(),
    trackFile: yup
      .mixed()
      .required()
      .test(
        'fileFormat',
        'Audio only',
        (value) => value && value[0] && value[0].type === 'audio/mpeg'
      ),
    artists: yup.array().default([]).required(),
  });

  const handleSubmit = async (input) => {
    const { artists, genre, album, trackFile, ...rest } = input;

    await mutation.mutateAsync({
      ...rest,
      artists: artists.map((a) => ({ id: a.value })),
      genre: { id: genre.value },
      album: { id: album.value },
      trackFile: trackFile[0],
    });
    router.push('/tracks');
  };

  return (
    <Layout title="Add Tracks">
      <h2 className="text-4xl mb-8">Add Tracks</h2>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <Form
          onSubmit={handleSubmit}
          schema={schema}
          defaultValues={{
            artists: [],
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

                <Input name="name" type="text" placeholder="Track Name" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="album"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Album
                </label>
                <SelectAutocomplete
                  name="album"
                  loadOptions={createPaginatedLoader(searchAlbums, {
                    total: 'totalAlbums',
                    all: 'albums',
                  })}
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
                <SelectAutocomplete
                  name="genre"
                  loadOptions={createPaginatedLoader(searchGenres, {
                    total: 'totalGenres',
                    all: 'genres',
                  })}
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
                  htmlFor="trackFile"
                >
                  Audio File
                </label>

                <FileUpload
                  name="trackFile"
                  label="Upload an audio file"
                  preview={(file, { clear }) => (
                    <div className="w-full h-[200px] mt-1 relative group flex justify-center items-center">
                      <div className="flex flex-col justify-center items-center">
                        <MusicNoteIcon className="h-12 w-12 text-gray-400" />
                        <h3 className="mt-3 text-2xl">{file.name}</h3>
                      </div>
                      <div className="bg-black bg-opacity-50 w-full h-full absolute top-0 flex justify-center items-center opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 ease-in-out">
                        <button
                          className="text-white h-10 w-10"
                          type="button"
                          onClick={clear}
                        >
                          <XCircleIcon className="h-full w-full" />
                        </button>
                      </div>
                    </div>
                  )}
                  icon={
                    <MusicNoteIcon className="mx-auto h-12 w-12 text-gray-400" />
                  }
                />
              </div>
            </div>

            {completed !== null && (
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 sm:col-span-2">
                  <Progress value={completed} />
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

export default withAuth(AddTracks);
