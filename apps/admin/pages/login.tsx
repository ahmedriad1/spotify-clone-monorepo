import {
  loginMutation,
  useAuthStore,
  withGuest,
} from '@spotify-clone-monorepo/auth';
import Link from 'next/link';
import { useState } from 'react';
import HeadlessLayout from '../components/HeadlessLayout';
import * as yup from 'yup';
import {
  Button,
  Form,
  Input,
  LazyImage,
  toast,
} from '@spotify-clone-monorepo/ui';

const Login = () => {
  const setLogin = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const {
        loginUser: { name, email, token, refreshToken },
      } = await loginMutation(data);
      setLoading(false);
      toast('success', 'Logged in successfully !');
      setLogin({ user: { name, email }, token, refreshToken });
    } catch (err) {
      toast('error', err?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <HeadlessLayout>
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
              Sign in to your account
            </h2>
          </div>
          <Form onSubmit={onSubmit} schema={schema} className="mt-8">
            <div>
              <div>
                <Input name="email" type="email" placeholder="Email address" />
              </div>
              <div className="mt-3">
                <Input name="password" type="password" placeholder="Password" />
              </div>
              <div className="mt-6">
                <Button loading={loading} className="w-full">
                  Sign in
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </HeadlessLayout>
  );
};

export default withGuest(Login);
