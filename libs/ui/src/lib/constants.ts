import { GroupBase, StylesConfig } from 'react-select';

export const SELECT_STYLES: StylesConfig<unknown, false, GroupBase<unknown>> = {
  indicatorSeparator: () => ({
    display: 'none',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#fff',
  }),
  control: ({ borderRadius, borderColor, padding, ...provided }) => ({
    ...provided,
    borderRadius: '0.5rem',
    overflow: 'hidden',
    backgroundColor: '#fff',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '4px 0',
    paddingLeft: '12px',
    backgroundColor: '#fff',
  }),
  option: (provided, state) => ({
    ...provided,
    color: 'rgb(17, 24, 39)',
    backgroundColor:
      !state.isSelected && !state.isFocused ? '#fff' : 'rgb(209, 250, 229)',
    ':hover': {
      background: 'rgb(209, 250, 229)',
    },
  }),
};

export const MULTISELECT_STYLES: StylesConfig<
  unknown,
  true,
  GroupBase<unknown>
> = {
  ...(SELECT_STYLES as object),
  multiValue: ({ background, backgroundColor, color, ...styles }) => ({
    ...styles,
    backgroundColor: 'rgb(29, 185, 84)',
  }),
  multiValueLabel: ({ color, padding, ...styles }) => ({
    ...styles,
  }),
  multiValueRemove: ({ ':hover': hover, ...styles }) => ({
    ...styles,
  }),
};
