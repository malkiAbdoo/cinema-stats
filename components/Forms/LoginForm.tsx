import { FC } from 'react';
import Link from 'next/link';
import { AuthProviders, VerticalLine } from './FormItems';
import Head from 'next/head';

const CredentialInputs: FC = () => {
  return (
    <>
      <input
        type="email"
        name="user[email]"
        placeholder="Email"
        className="credential-input"
        required
      />
      <input
        type="password"
        name="user[password]"
        placeholder="Password"
        className="credential-input"
        pattern=".{6,}"
        title="Password must be at least 6 characters"
        required
      />
    </>
  );
};

const LoginForm = () => {
  return (
    <form onSubmit={undefined} className="flex flex-col gap-4">
      <Head>
        <title>Login to Scatch</title>
      </Head>
      <AuthProviders text="Continue with" />
      <VerticalLine text="OR" />
      <CredentialInputs />
      <button type="submit" className="block theme-btn text-center">
        Login
      </button>
      <div className="text-neutral-500 my-2">
        New to scatch?{' '}
        <Link href="/register" className="dark:text-white text-dark underline">
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
