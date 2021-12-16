interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  loading,
  className,
  children,
  ...props
}) => (
  <button
    type="submit"
    disabled={loading}
    className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-sp-green hover:bg-opacity-80 focus:bg-opacity-80 focus:outline-none active:bg-opacity-70 transition duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-75 ${className}`}
    {...props}
  >
    {loading ? (
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    ) : (
      children
    )}
  </button>
);

export default Button;
