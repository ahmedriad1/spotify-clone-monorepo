import { FieldValues, useFormContext, UseFormReturn } from 'react-hook-form';

const ConnectForm: React.FC<{
  children: (data: UseFormReturn<FieldValues>) => React.ReactElement;
}> = ({ children }) => {
  const methods = useFormContext();

  return children({ ...methods });
};

export default ConnectForm;
