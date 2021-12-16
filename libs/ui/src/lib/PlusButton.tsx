import { PlusIcon } from '@heroicons/react/solid';
import RoundedButton from './RoundedButton';

const PlusButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  ...props
}) => {
  return (
    <RoundedButton {...props}>
      <PlusIcon className="w-6 h-6 m-auto" />
    </RoundedButton>
  );
};

export default PlusButton;
