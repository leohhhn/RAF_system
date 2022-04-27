import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import classNames from 'classnames';

import './Input.css';

type InputProps = {
  className?: string;
  iconClassName?: string;
  field?: string;
  placeholder?: string;
  type?: string;
  label?: string;
  value?: any;
  autoFocus?: boolean;
  retainFocus?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  onChange?: (...args: any) => void;
  onFocus?: (event: SyntheticEvent) => void;
  onBlur?: (event: SyntheticEvent) => void;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      type,
      field,
      className = '',
      iconClassName = '',
      label,
      autoFocus,
      retainFocus = false,
      autoComplete,
      placeholder,
      disabled,
      readOnly,
      onFocus,
      onBlur,
      onChange,
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (disabled || readOnly) {
        return;
      }

      if (!!ref && onChange) {
        onChange(event);
        return;
      }

      const newValue = event.target.value;

      if (onChange && field) {
        onChange(field, newValue, event);
      } else if (onChange) {
        onChange(newValue, event);
      }
    };

    const handleInputFocus = (event: SyntheticEvent) => {
      if (onFocus) {
        onFocus(event);
      }

      setFocused(true);
    };

    const handleInputBlur = (event: SyntheticEvent) => {
      if (onBlur) {
        onBlur(event);
      }

      if (retainFocus) return;

      setFocused(false);
    };

    return (
      <div
        className={classNames(
          'InputWrapper',
          {
            Active: !!value,
            Focused: focused && !disabled,
            Disabled: disabled,
            ReadOnly: readOnly,
          },
          className,
        )}
      >
        {!!label && !value.toString() && (
          <label htmlFor={`input-${field}`} className="InputLabel">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type || 'text'}
          className="Input"
          id={`input-${field}`}
          name={field}
          placeholder={placeholder}
          autoFocus={autoFocus}
          readOnly={readOnly}
          autoComplete={autoComplete}
          value={value}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
    );
  },
);

export { Input };
