import { useState, ChangeEvent } from 'react';

/**
 * Custom hook for managing form state
 * @param initialValues Initial form values
 * @returns Form state and handlers
 */
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setValues(prev => ({ ...prev, [name]: checked }));
    } else {
      setValues(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };
  
  // Handle checkbox array change (for multi-select options)
  const handleCheckboxArrayChange = (name: string, value: string, checked: boolean) => {
    setValues(prev => {
      const currentArray = Array.isArray(prev[name]) ? prev[name] : [];
      
      if (checked) {
        return { ...prev, [name]: [...currentArray, value] };
      } else {
        return { ...prev, [name]: currentArray.filter(item => item !== value) };
      }
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };
  
  // Set form errors
  const setFormErrors = (newErrors: Record<string, string>) => {
    setErrors(newErrors);
  };
  
  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleCheckboxArrayChange,
    setFormErrors,
    resetForm,
    setValues
  };
}
