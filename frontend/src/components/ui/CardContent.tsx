import React, { type FC, type ReactNode } from "react";

type CardContentProps = {
  children: ReactNode;
  className?: string;
};

export const CardContent: FC<CardContentProps> = ({ children, className }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};
