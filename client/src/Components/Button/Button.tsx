import React, { FC } from 'react';

import './Button.css';

type ButtonProps = {
  children: React.ReactNode;
  disabled: boolean;
  onClick: (event: React.MouseEvent) => void;
};

const Button: FC<ButtonProps> = ({ children, disabled, onClick }) => {
  return (
    <button className="Button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export { Button };
