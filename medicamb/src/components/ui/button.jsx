import * as React from 'react';
import { clsx } from 'clsx';

export const Button = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={clsx(
      'inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition',
      className
    )}
    {...props}
  />
));
Button.displayName = 'Button'; 