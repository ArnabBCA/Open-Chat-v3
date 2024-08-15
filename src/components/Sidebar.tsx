import { IoSettings, IoLogOut, IoLogoGithub } from 'react-icons/io5';
import {
  TbLayoutSidebarLeftExpandFilled,
  TbLayoutSidebarRightExpandFilled,
} from 'react-icons/tb';

import SidebarButtons from './wrappers/SidebarButtons';
import ProfilePic from './wrappers/ProfilePic.tsx';
import CheckOutsideClick from './utils/CheckOutSideClick';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../state/index.ts';
import AddNewContact from './sidebar button actions/AddNewContact.tsx';
import ToggleTheme from './sidebar button actions/ToggleTheme.tsx';
import Notification from './sidebar button actions/Notification.tsx';
import { useSelector } from '../hooks/useSelector.tsx';
import Chats from './sidebar button actions/Chats.tsx';

const Sidebar = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.isSidebarOpen);
  const currentUser = useSelector((state) => state.currentUser);

  if (!currentUser) return;

  const handleExpandClick = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="relative h-full min-w-16">
      <CheckOutsideClick handleClose={handleExpandClick} isOpen={isSidebarOpen}>
        <div
          className={`absolute z-10 flex h-full flex-col justify-between gap-2 bg-sidebar p-2 duration-300 ${isSidebarOpen ? 'w-60' : 'w-16'}`}
        >
          <div className="flex flex-col gap-2">
            <div
              onClick={() => {}}
              className="group relative flex w-full cursor-pointer items-center gap-2"
            >
              <ProfilePic
                photoURL={currentUser.photoURL}
                size={12}
                uid={currentUser.uid}
              />
              <div
                className={`absolute flex flex-col  ${isSidebarOpen ? 'translate-x-14' : 'hidden'}`}
              >
                <span className="w-40 overflow-hidden overflow-ellipsis whitespace-nowrap text-base text-inputText  duration-300">
                  {currentUser.displayName}
                </span>
                <span className="text-neutral-500">#{currentUser.code}</span>
              </div>
            </div>
            <Chats />
            <AddNewContact />
            <Notification />
            <ToggleTheme />
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
