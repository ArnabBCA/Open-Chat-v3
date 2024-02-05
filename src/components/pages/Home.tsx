import LeftConainer from '../LeftConainer';
import RightContainer from '../RightContainer';
import Sidebar from '../Sidebar';

const Home = () => {
  return (
    <div className="flex h-svh w-full bg-white">
      <Sidebar />
      <LeftConainer />
      <RightContainer />
    </div>
  );
};

export default Home;
