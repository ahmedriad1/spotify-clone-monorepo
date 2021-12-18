import { useRouter } from 'next/router';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import RoundedButton from './RoundedButton';

const BackButton = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <RoundedButton
      className="w-full h-full text-white bg-black flex items-center justify-center cursor-pointer"
      onClick={goBack}
    >
      <ChevronLeftIcon className="w-5 h-5" />
    </RoundedButton>
  );
};

export default BackButton;
