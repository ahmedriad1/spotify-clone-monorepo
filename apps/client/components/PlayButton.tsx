const PlayButton = ({ className, ...props }) => {
  return (
    <div
      className={`absolute ml-auto rounded-full overflow-hidden opacity-0 w-10 h-10 right-2 bottom-2 transition-all duration-300 ease-in-out transform translate-y-2 ${className}`}
      {...props}
    >
      <button
        className="w-full h-full flex bg-sp-green text-white border-none cursor-pointer transform transition-transform duration-[33ms] hover:scale-[1.06]"
        style={{ transitionTimingFunction: 'cubic-bezier(0.3, 0, 0, 1)' }}
      >
        <svg className="m-auto w-4 h-4" role="img" viewBox="0 0 24 24">
          <polygon
            points="21.57 12 5.98 3 5.98 21 21.57 12"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

export default PlayButton;
