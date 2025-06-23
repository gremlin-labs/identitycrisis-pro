import { useState } from 'react';

/**
 * Custom hook for managing form fields
 * @param {Object} initialValues - Initial values for the form fields
 * @returns {Array} [values, handleChange, resetForm, setValues]
 */
function useFormFields(initialValues) {
  const [values, setValues] = useState(initialValues);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const resetForm = () => {
    setValues(initialValues);
  };
  
  return [values, handleChange, resetForm, setValues];
}

export default useFormFields;
