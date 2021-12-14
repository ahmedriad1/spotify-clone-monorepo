/* eslint-disable-next-line */
export interface ButtonProps {}

export const Button: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded text-white">
      {children}
    </button>
  );
};

export default Button;
