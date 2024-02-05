import React, { useEffect, useRef, ReactNode } from 'react';

interface CheckOutsideClickProps {
  children?: ReactNode;
  handleClose?: () => void;
  isOpen?: boolean;
}

const CheckOutsideClick: React.FC<CheckOutsideClickProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      props.handleClose && props.handleClose();
    }
  };

  useEffect(() => {
    if (props.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [props.isOpen]);

  return (
    <div className="h-full" ref={ref}>
      {props.children}
    </div>
  );
};

export default CheckOutsideClick;
