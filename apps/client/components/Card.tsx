import { LazyImage } from '@spotify-clone-monorepo/ui';
import PlayButton from './PlayButton';

interface CardProps {
  data: {
    name: string;
    description: string;
    image: string;
  };
  roundedImage?: boolean;
}

const Card: React.FC<CardProps> = ({ data, roundedImage = false }) => {
  return (
    <div className="flex-1 w-full bg-[#181818] rounded overflow-hidden p-4 relative transition-colors duration-300 ease-in-out hover:bg-[#282828] group">
      <div
        className={`mb-4 relative aspect-square ${
          !roundedImage ? 'bg-[#333] shadow-card' : ''
        }`}
      >
        <LazyImage
          className={` rounded-sm ${
            roundedImage && 'rounded-full bg-[#333] shadow-card'
          }`}
          src={data.image}
          alt="Cover"
          objectFit="cover"
          objectPosition="center"
          layout="fill"
        />

        <PlayButton className="group-hover:opacity-100 group-hover:translate-y-0" />
      </div>

      <div className="min-h-[62px]">
        <h3 className="font-bold text-base tracking-normal leading-6 overflow-ellipsis	whitespace-nowrap">
          {data.name}
        </h3>

        <div className="mt-1 text-[#b3b3b3] text-sm font-normal leading-4 line-clamp-2">
          <span>{data.description}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
