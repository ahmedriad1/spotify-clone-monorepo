import { useState } from 'react';
import * as yup from 'yup';
import Link from 'next/link';
import {
  registerMutation,
  useAuthStore,
  withGuest,
} from '@spotify-clone-monorepo/auth';
import HeadlessLayout from '../components/HeadlessLayout';
import {
  Button,
  Form,
  Input,
  LazyImage,
  toast,
} from '@spotify-clone-monorepo/ui';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    confirm_password: yup
      .string()
      .min(8)
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required(),
  });
  const login = useAuthStore((state) => state.login);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const {
        createUser: { name, email, token, refreshToken },
      } = await registerMutation(data);
      setLoading(false);
      toast('success', 'Account created successfully !');
      login({ user: { name, email }, token, refreshToken });
    } catch (err) {
      toast('error', err?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <HeadlessLayout title="Register">
      <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div>
            <Link href="/">
              <a className="flex justify-center">
                <LazyImage
                  width={56}
                  height={56}
                  className="mx-auto h-14 w-auto"
                  src="/logo-main.png"
                  alt="Spotify logo"
                />
              </a>
            </Link>
            <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold">
              Create an account
            </h2>
            <p className="mt-2 text-center text-sm leading-5 text-gray-200">
              Or
              <Link href="/login">
                <a className="ml-1 font-medium text-sp-green hover:text-opacity-90 focus:outline-none focus:underline transition ease-in-out duration-150">
                  Already have an account ?
                </a>
              </Link>
            </p>
          </div>
          <Form className="mt-8" onSubmit={onSubmit} schema={schema}>
            <div>
              <div>
                <Input name="name" type="text" placeholder="Name" />
              </div>
              <div className="mt-3">
                <Input name="email" type="email" placeholder="Email address" />
              </div>
              <div className="mt-3">
                <Input name="password" type="password" placeholder="Password" />
              </div>

              <div className="mt-3">
                <Input
                  name="confirm_password"
                  type="password"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <div className="mt-6">
              <Button loading={loading} className="w-full">
                Register
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </HeadlessLayout>
  );
};

export default withGuest(Register);
