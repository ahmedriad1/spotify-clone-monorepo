import { AsyncSelectProps } from '@spotify-clone-monorepo/data-admin';
import { AsyncPaginate } from 'react-select-async-paginate';
import { SELECT_STYLES } from '../constants';
import ConnectForm from './ConnectForm';
import InputErrorMsg from './InputErrorMsg';
import IsolateRerender from './IsolateRerender';

const SelectAutoComplete: React.FC<AsyncSelectProps> = ({
  name,
  loadOptions,
  defaultValue,
}) => {
  return (
    <ConnectForm>
      {({ setValue, formState: { errors } }) => (
        <>
          <IsolateRerender fieldToWatch={name} defaultValue={defaultValue}>
            {({ [name]: selected }) => (
              <AsyncPaginate
                loadOptions={loadOptions}
                debounceTimeout={300}
                additional={{ page: 1 }}
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

export default SelectAutoComplete;
