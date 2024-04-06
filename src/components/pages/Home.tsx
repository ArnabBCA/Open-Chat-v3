import LeftConainer from '../LeftConainer';
import RightContainer from '../RightContainer';
import Sidebar from '../Sidebar';

const Home = () => {
  return (
    <div className="relative flex h-svh w-full bg-white overflow-x-hidden">
      <Sidebar />
      <LeftConainer />
      <RightContainer />
    </div>
  );
};

export default Home;
