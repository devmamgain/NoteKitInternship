import { useState } from "react";

const NavBar = ({ setSearching }) => {
  return (
    <nav className="flex sm2:p-3 sm:py-3 sm:px-1 bg-blue-500 fixed z-20 top-0 w-[100%]">
      <div className="flex gap-2 sm2:ml-[5%] ">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="sm2:size-9 sm:size-7 text-white">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
</svg>

      <h1 className="font-bold text-white sm2:text-3xl sm:text-xl">NoteKit</h1>
      </div>
      <input
        type="text"
        placeholder="Search by Title..."
        className=" rounded-3xl sm2:px-4 sm:px-2 focus:outline-none mx-auto"
        onChange={(e) =>setTimeout(()=> setSearching(e.target.value),[500])}
      />
    </nav>
  );
};

export default NavBar;
