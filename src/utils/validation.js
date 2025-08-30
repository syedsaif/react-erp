/**
 * Reusable field-level validation
 * @param {Object} options
 * @param {string} options.name - Field name (key)
 * @param {string|number|boolean} options.value - Value of the field
 * @param {string} [options.type=text] - Type of the field (text, email, phone, dropdown, etc.)
 * @param {boolean} [options.required=true] - Whether the field is required
 * @param {string} [options.label] - Display label for the error message
 * @param {number} [options.minLength] - Minimum length for the field
 * @param {number} [options.maxLength] - Maximum length for the field
 * @returns {Object} - { fieldName: "error message" } OR empty object
 */
export const validateField = ({
  name,
  value,
  type = "text",
  required = true,
  label,
  minLength,
  maxLength,
}) => {
  const errors = {};
  const displayName = label || name;

  // Required check
  if (required && !value?.toString().trim()) {
    errors[name] = `${displayName} is required.`;
    return errors;
  }

  // Type-specific validations
  if (type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors[name] = `Invalid ${displayName}.`;
      return errors;
    }
  }

  if (type === "phone") {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(value)) {
      errors[name] = `Invalid ${displayName}. Must be 10 digits.`;
      return errors;
    }
  }

  if (type === "dropdown") {
    if (!value) {
      errors[name] = `Please select a ${displayName}.`;
      return errors;
    }
  }

  if (minLength && value.length < minLength) {
    errors[name] = `${displayName} must be at least ${minLength} characters.`;
    return errors;
  }

  if (maxLength && value.length > maxLength) {
    errors[name] = `${displayName} must be at most ${maxLength} characters.`;
    return errors;
  }

  return errors;
};

/**
 * Validate Login form data
 * @param {Object} data - Login form data { username, password }
 * @returns {Object} errors - Object containing errors if any
 */
export const validateLogin = (data) => {
  let errors = {};

  errors = {
    ...errors,
    ...validateField({
      name: "username",
      value: data.username,
      type: "text",
      required: true,
      label: "Username",
      minLength: 3,
    }),
  };

  errors = {
    ...errors,
    ...validateField({
      name: "password",
      value: data.password,
      type: "text",
      required: true,
      label: "Password",
      minLength: 5,
    }),
  };

  return errors;
};
