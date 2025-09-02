import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "outline"
    | "ghost"
    | "gradient";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "lg",
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    "w-full inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary-800 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary:
      "bg-secondary-800 text-white hover:bg-secondary-700 focus:ring-secondary-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success:
      "bg-success-600 text-white hover:bg-transparent hover:text-black border-2 hover:border-primary focus:ring-success-400 ",
    outline:
      "border border-primary-400 text-primary-700 bg-transparent hover:bg-secondary-600 hover:text-white focus:ring-primary-300",
    ghost:
      "text-primary-700 bg-transparent hover:bg-primary-50 focus:ring-primary-300",
    gradient:
      "bg-gradient-button text-white hover:opacity-90 focus:ring-primary-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
