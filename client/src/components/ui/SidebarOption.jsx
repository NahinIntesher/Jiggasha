"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLayout } from "../Contexts/LayoutProvider";

export default function SidebarOption(props) {
  const router = useRouter();
  const {menu, toggleMenu} = useLayout();

  const pathname = usePathname();
  const isActive = pathname.startsWith(props.href);

  
  function goToLink(link) {
    router.push(link);
    if(menu) toggleMenu();
  }

  return (
    <div
      className={isActive? "menuOption active" : "menuOption"}
      onClick={()=>{goToLink(props.href)}}
    >      
      <div className="icon"><props.Icon className="" /></div>
      <div className="text">{props.label}</div>
    </div>
  );
}
