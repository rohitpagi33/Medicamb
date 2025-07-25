import * as React from 'react';
import { clsx } from 'clsx';

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      'block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input'; 