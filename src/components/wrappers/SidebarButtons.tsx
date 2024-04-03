import React, { ReactNode } from 'react';

interface SidebarButtonsProps {
  children?: ReactNode;
  expanded?: boolean;
  lable: string;
  onClick: () => void;
}

const SidebarButtons: React.FC<SidebarButtonsProps> = (props) => {
  return (
    <div
      onClick={props.onClick}
      className="group relative flex w-full items-center rounded-3xl bg-button text-green-600 shadow-xl duration-300 hover:rounded-2xl hover:bg-green-600 hover:text-white cursor-pointer"
    >
      <button className="z-10 flex h-12 w-12 items-center justify-center rounded-3xl text-2xl">
        {props.children}
      </button>
      <span
        className={`absolute whitespace-nowrap text-sm ${props.expanded ? 'opacity-1 translate-x-12' : 'translate-x-0 opacity-0'}`}
      >
        {props.lable}
      </span>
    </div>
  );
};

export default SidebarButtons;
