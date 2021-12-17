import { AsyncMultiselectProps } from '@spotify-clone-monorepo/data-admin';
import ConnectForm from './ConnectForm';
import IsolateRerender from './IsolateRerender';
import { AsyncPaginate } from 'react-select-async-paginate';
import InputErrorMsg from './InputErrorMsg';
import { MULTISELECT_STYLES } from '../constants';

const MultiselectAutoComplete: React.FC<AsyncMultiselectProps> = ({
  name,
  loadOptions,
  defaultValues,
}) => {
  return (
    <ConnectForm>
      {({ setValue, formState: { errors } }) => (
        <>
          <IsolateRerender fieldToWatch={name} defaultValue={defaultValues}>
            {({ [name]: selected }) => (
              <AsyncPaginate
                loadOptions={loadOptions}
                debounceTimeout={300}
                additional={{ page: 1 }}
                isMulti
                closeMenuOnSelect
                onChange={(val: unknown) =>
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

export default MultiselectAutoComplete;
