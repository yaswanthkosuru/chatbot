import Navbar from "@/components/navbar";
import Leftnavigation from "@/components/Leftbar";

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <Navbar />
      <Leftnavigation />

      <body className={` text-[18px] `}>
        <div className=" pl-80">
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  );
}
