export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
      <button
        {...props}
        className={`px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 ${props.className ?? ''}`}
      >
        {children}
      </button>
    );
  }
  