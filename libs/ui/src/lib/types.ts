import { GroupBase } from 'react-select';
import { LoadOptions } from 'react-select-async-paginate';

interface Additional {
  page: number;
}

export interface Option {
  value: string;
  label: string;
}

export interface AsyncMultiselectProps {
  name: string;
  defaultValues?: Option[];
  loadOptions: LoadOptions<unknown, GroupBase<unknown>, Additional>;
}

export interface AsyncSelectProps {
  name: string;
  defaultValue?: Option;
  loadOptions: LoadOptions<unknown, GroupBase<unknown>, Additional>;
}

export interface SelectProps {
  name: string;
  options: Option[];
  defaultValue?: Option;
}

export interface MultiselectProps {
  name: string;
  options: Option[];
  defaultValues?: Option[];
}
