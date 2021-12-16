import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormHTMLAttributes } from 'react';
import { AnyObjectSchema } from 'yup';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (data: any) => void;
  schema: AnyObjectSchema;
  defaultValues?: object;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  schema,
  defaultValues = {},
  children,
  ...props
}) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {},
  });
  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
