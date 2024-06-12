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
import { setTheme, toggleSidebar } from '../state/index.ts';

const Sidebar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const isSidebarOpen = useSelector((state) => state.isSidebarOpen);
  const currentUser = useSelector((state) => state.currentUser);
  console.log(currentUser);

  const handleExpandClick = () => {
    dispatch(toggleSidebar());
  };

  const handleThemeToggle = () => {
    dispatch(setTheme());
  };

  return (
    <div className="relative h-full min-w-16">
      <CheckOutsideClick handleClose={handleExpandClick} isOpen={isSidebarOpen}>
        <div
          className={`absolute flex h-full flex-col justify-between gap-2 overflow-y-scroll bg-sidebar p-2 duration-300 ${isSidebarOpen ? 'w-60' : 'w-16'}`}
        >
          <div className="flex flex-col gap-2">
            <div
              onClick={() => {}}
              className="group relative flex w-full cursor-pointer items-center gap-2"
            >
              <button className="flex h-12 w-12 items-center justify-center rounded-3xl text-2xl">
                <img
                  className="rounded-3xl duration-300 hover:rounded-2xl"
                  referrerPolicy="no-referrer"
                  src={currentUser.photoURL}
                  alt="Profile Pic"
                />
              </button>
              <span
                className={`absolute whitespace-nowrap text-base text-inputText ${isSidebarOpen ? 'translate-x-14' : 'hidden'}`}
              >
                {currentUser.displayName}
              </span>
            </div>
            <SidebarButtons onClick={() => {}} lable="Chats">
              <IoChatbubbles />
            </SidebarButtons>
            <SidebarButtons onClick={() => {}} lable="Video Call">
              <IoVideocam />
            </SidebarButtons>
            <SidebarButtons onClick={handleThemeToggle} lable="Toggle Theme">
              {theme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
            </SidebarButtons>
          </div>
          <div className="flex flex-col gap-2">
            <SidebarButtons onClick={() => {}} lable="Source Code">
              <IoLogoGithub />
            </SidebarButtons>
            <SidebarButtons onClick={() => {}} lable="Logout">
              <IoLogOut />
            </SidebarButtons>
            <SidebarButtons onClick={() => {}} lable="Settings">
              <IoSettings />
            </SidebarButtons>
            <SidebarButtons onClick={handleExpandClick} lable="Collaspe">
              {isSidebarOpen ? (
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
