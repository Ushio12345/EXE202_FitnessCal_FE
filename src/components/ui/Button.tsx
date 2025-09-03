import { cn } from "@/lib/utils";
import React from "react";

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
    "w-full inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-secondary focus:ring-primary",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary-600 focus:ring-secondary",
    danger:
      "bg-destructive text-destructive-foreground hover:bg-error-600 focus:ring-error-400",
    success:
      "bg-success text-success-foreground hover:bg-transparent hover:text-text-success border-2 hover:border-primary focus:ring-success",
    outline:
      "border border-primary bg-transparent text-text-primary hover:bg-secondary hover:text-secondary-foreground focus:ring-primary",
    ghost:
      "text-text-primary bg-transparent hover:bg-primary-50 focus:ring-primary",
    gradient:
      "bg-gradient-button text-white hover:opacity-90 focus:ring-primary",
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
