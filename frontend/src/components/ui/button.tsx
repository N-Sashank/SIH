import React, { type ButtonHTMLAttributes, type FC } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const Button: FC<ButtonProps> = ({ children, variant = "primary", className, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-700 text-gray-100 hover:bg-gray-600",
  };

  return (
    <button className={clsx(baseClasses, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
