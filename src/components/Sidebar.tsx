import { useState } from 'react';
import CheckOutsideClick from './utils/CheckOutSideClick';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="relative h-full min-w-16">
      <CheckOutsideClick handleClose={handleExpandClick} isOpen={expanded}>
        <div
          className={`transition-width absolute h-full bg-gray-200 duration-300 ${expanded ? 'w-60' : 'w-16'} `}
        >
          <button onClick={handleExpandClick}>Expand</button>
        </div>
      </CheckOutsideClick>
    </div>
  );
};

export default Sidebar;
