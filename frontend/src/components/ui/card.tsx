import React, { type FC, type ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card: FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};
