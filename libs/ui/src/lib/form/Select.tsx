import BaseSelect from 'react-select';
import { SELECT_STYLES } from '../constants';
import { SelectProps } from '../types';
import ConnectForm from './ConnectForm';
import InputErrorMsg from './InputErrorMsg';
import IsolateRerender from './IsolateRerender';

const Select: React.FC<SelectProps> = ({ name, options, defaultValue }) => {
  return (
    <ConnectForm>
      {({ setValue, formState: { errors } }) => (
        <>
          <IsolateRerender fieldToWatch={name} defaultValue={defaultValue}>
            {({ [name]: selected }) => (
              <BaseSelect
                options={options}
                closeMenuOnSelect
                onChange={(val) =>
                  setValue(name, val, { shouldValidate: true })
                }
                value={selected}
                inputId={name}
                styles={SELECT_STYLES}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          </IsolateRerender>
          <InputErrorMsg error={errors[name]} />
        </>
      )}
    </ConnectForm>
  );
};

export default Select;
