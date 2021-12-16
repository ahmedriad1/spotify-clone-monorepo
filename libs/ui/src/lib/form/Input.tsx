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
        className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-${
          error ? 'red' : 'gray'
        }-300 placeholder-${
          error ? 'red' : 'gray'
        }-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-${
          error ? 'red' : 'blue'
        }-300 focus:z-10 sm:text-sm sm:leading-5`}
        {...props}
        {...register(name)}
      />
      <InputErrorMsg error={error} />
    </>
  );
};

export default Input;
