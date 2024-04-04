import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';

interface SidebarButtonsProps {
  children?: ReactNode;
  lable: string;
  onClick: () => void;
}

const SidebarButtons: React.FC<SidebarButtonsProps> = (props) => {
  const isSidebarOpen = useSelector((state) => state.isSidebarOpen);
  return (
    <div
      onClick={props.onClick}
      className="group relative flex w-full cursor-pointer items-center rounded-3xl bg-button text-green-600 shadow-xl duration-300 hover:rounded-2xl hover:bg-green-600 hover:text-white"
    >
      <button className="z-10 flex h-12 w-12 items-center justify-center rounded-3xl text-2xl">
        {props.children}
      </button>
      <span
        className={`absolute whitespace-nowrap text-sm ${isSidebarOpen ? 'opacity-1 translate-x-12' : 'translate-x-0 opacity-0'}`}
      >
        {props.lable}
      </span>
    </div>
  );
};

export default SidebarButtons;
