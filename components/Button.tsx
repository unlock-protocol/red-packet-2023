interface ButtonProps {
  onClick: () => void;
  children: any;
  className?: string;
}

export const Button = ({ onClick, children, className }: ButtonProps) => {
  const buttonClasses = `bg-darkred border-yellow border text-yellow py-2 px-4 rounded-full whitespace-nowrap ${className}`;

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};
