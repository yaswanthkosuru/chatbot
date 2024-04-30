import React from "react";
import Link from "next/link";
const Leftnavigation = () => {
  return (
    <div className="fixed left-0 top-0 bottom-0  w-72 bg-gray-100 border-r border-gray-200 flex flex-col pt-56 items-center z-40">
      <Link
        href="/topics"
        className="w-full py-2 px-4 bg-gray-200 text-gray-700 mb-4 rounded hover:bg-gray-300 transition duration-300"
      >
        TOPICS
      </Link>
      <Link
        href="/rooms"
        className="w-full py-2 px-4 bg-gray-200 text-gray-700 mb-4 rounded hover:bg-gray-300 transition duration-300"
      >
        MY ROOMS
      </Link>
      <Link
        href="/allrooms"
        className="w-full py-2 px-4 bg-gray-200 text-gray-700 mb-4 rounded hover:bg-gray-300 transition duration-300"
      >
        ALL ROOMS
      </Link>
    </div>
  );
};

export default Leftnavigation;
