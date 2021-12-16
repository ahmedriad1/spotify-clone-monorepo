const RoundedButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, ...props }) => {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden">
      <button className="w-full h-full bg-sp-green text-white" {...props}>
        {children}
      </button>
    </div>
  );
};

export default RoundedButton;
