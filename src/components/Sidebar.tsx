import { useState } from 'react';
import SidebarButtons from './wrappers/SidebarButtons';
import CheckOutsideClick from './utils/CheckOutSideClick';
import {
  IoHome,
  IoSettings,
  IoChatbubbles,
  IoLogOut,
  IoVideocam,
  IoLogoGithub,
} from 'react-icons/io5';
import {
  TbLayoutSidebarLeftExpandFilled,
  TbLayoutSidebarRightExpandFilled,
} from 'react-icons/tb';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../state/index.ts';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleThemeToggle = () => {
    dispatch(setTheme());
  };

  return (
    <div className="t relative h-full min-w-16">
      <CheckOutsideClick handleClose={handleExpandClick} isOpen={expanded}>
        <div
          className={`absolute flex h-full flex-col justify-between gap-2 bg-sidebar p-2 duration-300 ${expanded ? 'w-60' : 'w-16'}`}
        >
          <div className="flex flex-col gap-2">
            <SidebarButtons onClick={() => {}} lable='Home' expanded={expanded}>
              <IoHome />
            </SidebarButtons>
            <SidebarButtons onClick={() => {}} lable='Chats' expanded={expanded}>
              <IoChatbubbles />
            </SidebarButtons>
            <SidebarButtons onClick={() => {}} lable='Video Call' expanded={expanded}>
              <IoVideocam />
            </SidebarButtons>
            <SidebarButtons onClick={handleThemeToggle} lable='Toggle Theme' expanded={expanded}>
              {theme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
            </SidebarButtons>
          </div>
          <div className="flex flex-col gap-2">
            <SidebarButtons onClick={() => {}} lable='Source Code' expanded={expanded}>
              <IoLogoGithub />
            </SidebarButtons>
            <SidebarButtons onClick={() => {}} lable='Logout' expanded={expanded}>
              <IoLogOut />
            </SidebarButtons>
            <SidebarButtons onClick={() => {}} lable='Settings' expanded={expanded}>
              <IoSettings />
            </SidebarButtons>
            <SidebarButtons onClick={handleExpandClick} expanded={expanded} lable='Collaspe'>
              {expanded ? (
                <TbLayoutSidebarRightExpandFilled />
              ) : (
                <TbLayoutSidebarLeftExpandFilled />
              )}
            </SidebarButtons>
          </div>
        </div>
      </CheckOutsideClick>
    </div>
  );
};

export default Sidebar;
