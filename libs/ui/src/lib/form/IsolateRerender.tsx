import { useFormContext, useWatch } from 'react-hook-form';

interface IsolateRerenderProps {
  fieldToWatch: string;
  defaultValue?: unknown;
  children: (data: { [key: string]: unknown }) => React.ReactElement;
}

const IsolateRerender: React.FC<IsolateRerenderProps> = ({
  children,
  fieldToWatch,
  defaultValue,
}) => {
  const { control } = useFormContext();
  const field = useWatch({
    control,
    name: fieldToWatch,
    defaultValue,
  });

  return children({ [fieldToWatch]: field });
};

export default IsolateRerender;
