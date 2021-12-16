import { FieldError } from 'react-hook-form';

const InputErrorMsg: React.FC<{ error: FieldError }> = ({ error }) =>
  error?.message ? (
    <span className="text-red-600 text-xs font-medium">{error.message}</span>
  ) : null;

export default InputErrorMsg;
