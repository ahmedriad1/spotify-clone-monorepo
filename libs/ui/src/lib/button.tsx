import { LoadingIcon } from './Icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  loading,
  className = '',
  children,
  ...props
}) => (
  <button
    type="submit"
    disabled={loading}
    className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-sp-green hover:bg-opacity-80 focus:bg-opacity-80 focus:outline-none active:bg-opacity-70 transition duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-75 ${className}`}
    {...props}
  >
    {loading ? <LoadingIcon className="w-5 h-5 text-white" /> : children}
  </button>
);

export default Button;
