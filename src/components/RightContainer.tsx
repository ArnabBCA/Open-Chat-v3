import { useRef, useEffect } from 'react';
import Input from './Input';
import CheckOutsideClick from './utils/CheckOutSideClick';
import Chats from './Chats';
import { useDispatch } from 'react-redux';
import { useSelector } from '../hooks/useSelector';
import { toggleIsMobile } from '../state';

const RightContainer = () => {
  const dispatch = useDispatch();
  const isMobile = useSelector((state) => state.isMobile);
  const containerRef = useRef<HTMLDivElement>(null);

  const slideBack = () => {
    dispatch(toggleIsMobile());
  };

  const addProperty = () => {
    if (containerRef.current) {
      containerRef.current.style.transitionDuration = '500ms';
      containerRef.current.style.transitionProperty = 'transform';
      window.addEventListener('resize', removeProeprty);
    }
  };

  const removeProeprty = () => {
    if (containerRef.current) {
      containerRef.current.style.transitionDuration = '';
      containerRef.current.style.transitionProperty = '';
      window.removeEventListener('resize', removeProeprty);
    }
  };

  useEffect(() => {
    addProperty();
    return () => {
      removeProeprty();
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className={`absolute z-10 h-full w-full flex-1 ${isMobile ? 'translate-x-[calc(-3rem+100%)]' : 'translate-x-0'} bg-right transition-colors duration-300 sm:relative sm:translate-x-0`}
    >
      {/*<div className={`${isMobile ? 'block' : 'hidden'} absolute h-full w-full bg-black opacity-50`}></div>*/}
      <div className="h-16">
        <CheckOutsideClick isOpen={isMobile} handleClose={removeProeprty}>
          <button onClick={slideBack}>Back</button>
        </CheckOutsideClick>
      </div>
      <Chats />
      <Input />
    </div>
  );
};

export default RightContainer;
