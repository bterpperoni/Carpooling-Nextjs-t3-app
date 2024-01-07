
import type { ButtonProps } from "$/utils/interface";


function Button({href, onClick, children, ...props }: ButtonProps) {
  const buttonProps = {
    ...props,
    children,
    onClick
  };

  if (href) {
    return (
      <a href={href} {...buttonProps}>
        {children}
      </a>
    );
  } else {
    return (
      <button {...buttonProps}>
        {children}
      </button>
    );
  }
}

export default Button;