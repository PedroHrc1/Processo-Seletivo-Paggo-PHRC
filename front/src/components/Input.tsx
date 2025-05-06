import { InputHTMLAttributes } from 'react';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`border p-2 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none ${props.className ?? ''}`}
    />
  );
}
