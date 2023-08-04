 

import React from 'react';

const button = (className, { intent, size, block }) => {
  const variants = {
    intent: {
    primary: [
      'bg-red-400 text-white hover:bg-transparent duration-200 ease-in-out',
    ],
    secondary: [
      'bg-brand-cerulean-blue text-white hover:bg-brand-cerulean-blue-dark transition-colors duration-200 ease-in-out',
    ],
  },
    size: {
      small: ['text-md', 'h-[52px]', 'px-2'],
      medium: ['text-base', 'h-[60px]', 'px-4'],
      large: ['text-lg', 'h-[68px]', 'px-6'],
    },
    block: {
      true: ['w-full'],
      false: ['w-auto'],
    },
  };

  const intentStyles = variants.intent[intent] || [];
  const sizeStyles = variants.size[size] || [];
  const blockStyles = variants.block[block] || [];

  return {
    className: `${className} ${intentStyles.join(' ')} ${sizeStyles.join(' ')} ${blockStyles.join(' ')}`,
  };
};

const Button = ({ className, intent, size, block, ...props }) => (
  <button {...button(className, { intent, size, block })} {...props} />
);

export default Button;
