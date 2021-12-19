import { useFormContext } from 'react-hook-form';
import InputErrorMsg from './InputErrorMsg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const Input: React.FC<InputProps> = ({ name, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <>
      <input
        className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${
          error ? 'placeholder-red-500' : 'placeholder-gray-500'
        } text-gray-900 focus:outline-none focus:shadow-outline-blue ${
          error ? 'focus:border-red-300' : 'focus:border-blue-300'
        } focus:z-10 sm:text-sm sm:leading-5`}
        {...props}
        {...register(name)}
      />
      <InputErrorMsg error={error} />
    </>
  );
};

export default Input;
