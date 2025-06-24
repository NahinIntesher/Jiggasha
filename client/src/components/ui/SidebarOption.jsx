"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLayout } from "../Contexts/LayoutProvider";

export default function SidebarOption(props) {
  const pathname = usePathname();
  const { menu, toggleMenu } = useLayout();

  const isActive = pathname.startsWith(props.href);

  return (
    <Link
      href={props.href}
      className={isActive ? "menuOption active" : "menuOption"}
      onClick={menu ? toggleMenu : undefined}
      prefetch={true}
    >
      <div className="icon">
        <props.Icon className="" />
      </div>
      <div className="text">{props.label}</div>
    </Link>
  );
}
