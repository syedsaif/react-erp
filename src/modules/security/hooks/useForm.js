import { useState, useEffect, useRef } from "react";

export default function useForm(initialValues, validate, onSubmit) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const prevInitialValuesRef = useRef();

  useEffect(() => {
    // Deep compare initialValues to avoid resetting formData unnecessarily
    if (JSON.stringify(prevInitialValuesRef.current) !== JSON.stringify(initialValues)) {
      setFormData(initialValues);
      setErrors({});
      prevInitialValuesRef.current = initialValues;
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData, // optional, if you want to reset or manipulate from outside
  };
}
