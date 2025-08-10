import ReactSelect from 'react-select';
import styles from './form-controls.module.scss';

export const Select = ({options, ...props}) => {
  // const customStyles = {
  //   control: (base) => ({
  //     ...base,
  //     // backgroundColor: '#f8f9fa',
  //     borderColor: '#ced4da',
  //     boxShadow: 'none',
  //     '&:hover': { borderColor: '#adb5bd' },
  //   }),
  //   option: (base, { isFocused }) => ({
  //     ...base,
  //     // backgroundColor: isFocused ? '#e9ecef' : 'white',
  //     color: '#212529',
  //   }),
  // };

  return (
    <ReactSelect
      // styles={customStyles}
      options={options}
      classNamePrefix="select"
      {...props}
    />
  );
};

export const TextInput = ({...props}) => {
  return (
    <input className={styles.input} type="text" {...props} />
  )
}
