import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../main';

interface SidebarButtonsProps {
  children?: ReactNode;
  lable: string;
  onClick: () => void;
}

const SidebarButtons: React.FC<SidebarButtonsProps> = (props) => {
  const isSidebarOpen = useSelector((state: RootState) => state.isSidebarOpen);
  return (
    <div
      onClick={props.onClick}
      className="group relative flex w-full cursor-pointer items-center rounded-3xl bg-button text-sidebarButtonAccent shadow-xl duration-300 hover:rounded-2xl hover:bg-sidebarButtonAccent hover:text-white"
    >
      <button className=" flex h-12 w-12 items-center justify-center rounded-3xl text-2xl">
        {props.children}
      </button>
      <span
        className={`absolute whitespace-nowrap text-sm ${isSidebarOpen ? 'translate-x-12' : 'hidden'}`}
      >
        {props.lable}
      </span>
    </div>
  );
};

export default SidebarButtons;
