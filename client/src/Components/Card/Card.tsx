import React, { FC } from 'react';

import './Card.css';

type CardProps = {
  children: React.ReactNode;
};

const Card: FC<CardProps> = ({ children }) => {
  return (
    <div className="Card">
      {children}
    </div>
  );
};

export { Card };
