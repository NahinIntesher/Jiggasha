"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function SidebarOption(props) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(props.href);

  return (
    <Link
      className={isActive? "menuOption active" : "menuOption"}
      href={props.href}
    >      
      <div className="icon"><props.Icon className="" /></div>
      <div className="text">{props.label}</div>
    </Link>
  );
}
