type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  };
  
  export default function Button({ children, className = "", ...props }: ButtonProps) {
    return (
      <button
        className={`bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition active:scale-95 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }