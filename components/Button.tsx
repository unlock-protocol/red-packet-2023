interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const buttonClasses = `enabled:hover:bg-red enabled:bg-darkred border-yellow border text-yellow py-2 px-4 rounded-full whitespace-nowrap`;

export const Button = ({
  onClick,
  children,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      className={`${buttonClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
