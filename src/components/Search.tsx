import { IoIosSearch } from 'react-icons/io';

const Search = () => {
  return (
    <div className="flex h-12 w-full items-center gap-2 rounded-lg bg-input shadow-xl duration-300 px-4">
      <input
        type="text"
        placeholder="Search by name or #0000"
        className="h-full w-full bg-transparent text-inputText outline-none"
      />
      <IoIosSearch className="text-3xl text-neutral-500" />
    </div>
  );
};

export default Search;
