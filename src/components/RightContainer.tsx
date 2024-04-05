import Input from './Input';

const RightContainer = () => {
  return (
    <div className="h-full flex-1 bg-right transition-colors duration-300">
      <div className="h-16">Top</div>
      <div className="h-[calc(100%_-_8rem)] ">Center</div>
      <div className="h-16 p-2">
        <Input />
      </div>
    </div>
  );
};

export default RightContainer;
