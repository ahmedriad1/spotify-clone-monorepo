const Progress: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="w-full rounded-full bg-gray-300 text-xs overflow-hidden">
      <div
        className="bg-sp-green h-full py-1 rounded-r-full text-center"
        style={{ width: `${value}%` }}
      >
        {value}%
      </div>
    </div>
  );
};

export default Progress;
