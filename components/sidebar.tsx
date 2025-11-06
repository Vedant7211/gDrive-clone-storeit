"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SIDEBAR_ITEMS } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { avatarPlaceholderUrl } from "@/constants";

const Sidebar = ({ fullName, email }: { fullName: string; email: string }) => {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={224}
          height={82}
          className="h-auto hidden lg:block"
        />
      </Link>

      <Image
        src="/assets/icons/logo-brand.svg"
        alt="logo"
        width={224}
        height={82}
        className=" lg:hidden"
      />
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {SIDEBAR_ITEMS.map(({ name, href, icon }) => (
            <Link href={href} key={name}>
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === href && "shad-active",
                )}
              >
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn("nav-icon", pathname === href && "shad-active")}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      <Image
        src="/assets/images/files-2.png"
        alt="logout"
        width={506}
        height={418}
        className="hidden lg:block"
      />
      <div className="sidebar-user-info">
        <Image
          src={avatarPlaceholderUrl}
          alt="user"
          width={24}
          height={24}
          className="sidebar-user-avatar"
        />
       <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
