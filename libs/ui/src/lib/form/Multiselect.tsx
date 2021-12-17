import Select from 'react-select';
import { MULTISELECT_STYLES } from '../constants';
import { MultiselectProps } from '../types';
import ConnectForm from './ConnectForm';
import InputErrorMsg from './InputErrorMsg';
import IsolateRerender from './IsolateRerender';

const Multiselect: React.FC<MultiselectProps> = ({
  name,
  options,
  defaultValues,
}) => {
  return (
    <ConnectForm>
      {({ setValue, formState: { errors } }) => (
        <>
          <IsolateRerender fieldToWatch={name} defaultValue={defaultValues}>
            {({ [name]: selected }) => (
              <Select
                options={options}
                isMulti
                closeMenuOnSelect
                onChange={(val) =>
                  setValue(name, val, { shouldValidate: true })
                }
                value={selected}
                inputId={name}
                styles={MULTISELECT_STYLES}
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

export default Multiselect;
