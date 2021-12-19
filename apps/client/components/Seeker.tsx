import { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';

interface SeekerProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  playheadSize?: number;
  width?: number;
}

const Seeker: React.FC<SeekerProps> = ({
  value,
  max,
  onChange,
  playheadSize = 12,
  width,
  onChangeEnd,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Range
      step={1}
      min={0}
      max={max || 1}
      values={[value]}
      onChange={(newValues) => onChange(newValues[0])}
      onFinalChange={(newValues) => onChangeEnd && onChangeEnd(newValues[0])}
      renderTrack={({ props, children, isDragged }) => (
        <div
          onTouchStart={props.onTouchStart}
          onMouseDown={props.onMouseDown}
          onMouseOver={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{ width: width || '100%' }}
          className="track h-3 flex items-center"
        >
          <div
            ref={props.ref}
            style={{
              ...props.style,
              cursor: 'default',
              width: '100%',
              height: 4,
              borderRadius: 2,
              background: getTrackBackground({
                values: [value],
                colors: [
                  isHovering || isDragged ? '#1db954' : '#b3b3b3',
                  '#535353',
                ],
                min: 0,
                max: max || 1,
              }),
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ props, isDragged }) => (
        <div
          {...props}
          style={{
            ...props.style,
            opacity: isDragged || isHovering ? 1 : 0,
            background: '#fff',
            borderRadius: '50%',
            height: playheadSize,
            width: playheadSize,
            cursor: 'default',
          }}
          className="thumb"
        />
      )}
    />
  );
};

export default Seeker;
