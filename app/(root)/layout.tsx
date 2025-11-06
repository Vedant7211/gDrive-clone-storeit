import React from "react";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobileNav";
import Header from "@/components/header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  return (
    <main className="flex h-screen">
        
      <Sidebar {...currentUser} />
      <section className="flex-1 h-full flex-col">
        <Header {...currentUser} />
        <MobileNav {...currentUser} />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
};

export default Layout;
