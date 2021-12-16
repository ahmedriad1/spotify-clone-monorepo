import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Album } from '../types/models';
import Card from './Card';

const minCardWidth = 200;

interface CardSectionProps {
  data: {
    name: string;
    description: string;
    link: string;
    itemLink: string;
  };
  albums: Album[];
}

const CardSection: React.FC<CardSectionProps> = ({ data, albums }) => {
  const [limiter, setLimiter] = useState(0);
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const handleWindowResize = () => {
      if (!ref.current) return;
      const calculation = Math.floor(
        ref.current.getBoundingClientRect().width / minCardWidth
      );

      setLimiter(calculation);
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div className="pb-4" ref={ref}>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold mb-0">{data.name}</h2>
        <Link href={data.link}>
          <a className="text-[#b3b3b3] uppercase border-b-2 border-solid border-transparent text-sm hover:text-white hover:underline">
            see all
          </a>
        </Link>
      </div>
      {data.description && (
        <p className="text-[#cccccc] mt-2 mb-5">{data.description}</p>
      )}

      <div
        className={`grid grid-cols-cards gap-6 grid-rows-[1fr] overflow-y-hidden auto-rows-[0]`}
      >
        {[...albums].splice(0, limiter).map((item) => (
          <Link key={item.id} href={data.itemLink.replace(':id', item.id)}>
            <a>
              <Card
                data={{
                  name: item.name,
                  description:
                    item.description ||
                    item.artists.map((artist) => artist.name).join(', '),
                  image: item.imageUrl,
                }}
              />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CardSection;
