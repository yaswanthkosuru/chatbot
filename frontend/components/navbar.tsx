"use client";
import React, { useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  useEffect(() => {
    console.log(
      sessionStorage.getItem("usertoken"),
      sessionStorage.getItem("admintoken")
    );
  }, []);
  return (
    <nav className="bg-[#224C84] p-4 z-50 mb-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link href="/">logo</Link>
        </div>
        <div>
          <button className="mr-4 px-4 py-2 rounded-md bg-white text-[#224C84] ">
            <Link href="/login">login</Link>
          </button>
          <button className="px-4 py-2 rounded-md bg-white text-[#224C84] ">
            <Link href="/signup">signup</Link>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
