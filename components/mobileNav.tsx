"use client"
import React, { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
    
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SIDEBAR_ITEMS } from "@/constants";
import { cn } from "@/lib/utils";   
import Link from "next/link";
import { Button } from "./ui/button";
import { avatarPlaceholderUrl } from "@/constants";
import { signOutUser } from "@/lib/actions/user.actions";
import FileUploader from "./fileUploader";
interface Props {
    ownerId: string;
    accountId: string;
    fullName: string;
    avatar: string;
    email: string;
  }

const MobileNav = ( { ownerId, fullName, avatar, email ,accountId }: Props ) => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    
  return  <header className="mobile-header">
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="Search"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <div className="header-user">
              <Image
                src={avatarPlaceholderUrl}
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>
          <nav className = "mobile-nav">
            <ul className = "mav-nav-list">
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
                        <p>{name}</p>
                      </li>
                    </Link>
                  ))}
            </ul>
            
          </nav>
        <Separator className = "my-5 bg-light-200/20"/>

        <div className="flex flex-col justify-between gap-5 pb-5">
      <FileUploader ownerId={ownerId} accountId={accountId} className="mobile-file-uploader"/>   
        <Button type="submit" className="mobile-sign-out-button" onClick={async () => await signOutUser()}>
            <Image
              src="/assets/icons/upload.svg"
              alt="upload"
              width={24}
              height={24}
              className="mr-2"
            />
            Logout
            </Button> 
        </div>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
  </SheetContent>
</Sheet>
  </header>
};

export default MobileNav;
