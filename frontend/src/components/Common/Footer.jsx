import React from "react";

function Footer() {
  return (
    <footer className="py-4 sm:py-6 px-4 sm:px-8 md:px-20">
      <div className="flex flex-col items-center">
        <div className="w-full h-[1px] bg-black opacity-20 mb-4 sm:mb-6"></div>
        <h2 className="text-xs sm:text-sm md:text-md text-primary text-center">
          ©2024 Emmanuel Kasuti. All Rights Reserved
        </h2>
      </div>
    </footer>
  );
}

export default Footer;