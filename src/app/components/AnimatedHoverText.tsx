import React, { ReactNode } from "react";

export default function AnimatedHoverText({
  children,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`relative  text-primary text-[14px] md:text-[18px] 
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] 
                  after:bg-current after:transition-all after:duration-300 hover:after:w-full hidden md:inline-block`}
    >
      {children}
    </span>
  );
}
