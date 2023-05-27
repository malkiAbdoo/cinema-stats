import { signUp } from '@/utils';
import { FC, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from '@/hooks/useForm';
import { SignUpFormData, WithFormError } from '@/types';
import { AuthProviders, ErrorMessage, SubmitButton, VerticalLine } from './FormItems';
import { BiShow as ShowIcon, BiHide as HideIcon } from 'react-icons/bi';

type CredentialInputsProps = {
  data: SignUpFormData & WithFormError;
  handleInput: (e: any) => void;
};
const CredentialInputs: FC<CredentialInputsProps> = ({ data, handleInput }) => {
  const { firstName, lastName, email, password, error } = data;
  const name = firstName.trim() + lastName.trim();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      <div>
        <div className="align-center flex gap-x-4">
          <input
            id="firstName"
            type="text"
            name="user[first_name]"
            placeholder="First name"
            className={`credential-input ${error == 'Name' ? 'error' : ''}`}
            value={firstName}
            onInput={handleInput}
            required
          />
          <input
            id="lastName"
            type="text"
            name="user[last_name]"
            placeholder="Last name"
            className={`credential-input ${error == 'Name' ? 'error' : ''}`}
            value={lastName}
            onInput={handleInput}
          />
        </div>
        {error == 'Name' &&
          (name.length > 30 ? (
            <ErrorMessage>Username is too long!</ErrorMessage>
          ) : name.length < 3 ? (
            <ErrorMessage>Username is too short!</ErrorMessage>
          ) : /[^\w]/.test(name) ? (
            <ErrorMessage>No spaces and special characters!</ErrorMessage>
          ) : null)}
      </div>
      <div>
        <input
          id="email"
          type="email"
          name="user[email]"
          placeholder="Email"
          className={`credential-input ${error == 'Email' ? 'error' : ''}`}
          value={email}
          onInput={handleInput}
          required
        />
        {error == 'Email' && <ErrorMessage>This email is already exists!</ErrorMessage>}
      </div>
      <div>
        <div className="flex h-full w-full items-center rounded-3xl border border-neutral-500 pr-3 text-gray-400 outline-offset-[-2px] focus-within:text-current focus-within:outline focus-within:outline-2">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="user[password]"
            placeholder="Password (min. 6 characters)"
            className={`h-full w-full rounded-inherit bg-transparent px-4 py-3 focus:outline-none ${
              error == 'Password' ? 'error' : ''
            }`}
            title="Password must be at least 6 characters"
            value={password}
            onInput={handleInput}
            required
          />
          <button type="button" className="h-full" onClick={() => setShowPassword(!showPassword)}>
            {showPassword && <ShowIcon size={22} />}
            {!showPassword && <HideIcon size={22} />}
          </button>
        </div>
        {error == 'Password' && <ErrorMessage>Password minimum 6 characters!</ErrorMessage>}
      </div>
    </>
  );
};

const SignUpForm: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const form = useForm<SignUpFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  function validate(input: WithFormError['error'], text: string) {
    if (!input) return;
    const patterns = {
      Name: /^[a-z_A-Z]{3,15} [a-z_A-Z]{0,15}$/m,
      Email: /^[\w-\.]+@([\w-]+\.)+\w{2,7}$/,
      Password: /.{6,}/
    };
    const isValid = patterns[input].test(text);
    if (!isValid) form.setError(input);
    return isValid;
  }

  function inputHandler(e: any) {
    const { id, value } = e.target as Record<string, string>;
    form.handleInput(e);
    form.setError(undefined);

    const { firstName, lastName, email, password } = form.data;
    switch (id) {
      case 'email':
        if (validate('Name', firstName.trim() + ' ' + lastName.trim())) {
          validate('Email', value);
        }
        break;
      case 'password':
        if (
          validate('Name', firstName.trim() + ' ' + lastName.trim()) &&
          validate('Email', email)
        ) {
          validate('Password', value);
        }
        break;
      default:
        if (id == 'firstName') validate('Name', value.trim() + ' ' + lastName.trim());
        else validate('Name', firstName.trim() + ' ' + value.trim());
        break;
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(!form.data.error);
    if (form.data.error) return;

    // trying to sign up
    const { user, error } = await signUp(form.data);
    if (!user) {
      if (error == 'Email') form.setError('Email');
      setIsSubmitting(false);
      return;
    }

    // Login with the new account
    const { email, password } = form.data;
    signIn('credentials', { email, password, callbackUrl: '/' });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4" autoComplete="on">
      <AuthProviders text="Join using" />
      <VerticalLine text="or join with your email" />
      <CredentialInputs data={form.data} handleInput={inputHandler} />
      <SubmitButton {...{ text: 'Sign Up', isSubmitting }} />
    </form>
  );
};
export default SignUpForm;
