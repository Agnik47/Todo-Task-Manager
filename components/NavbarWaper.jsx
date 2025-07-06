'use client'
import { usePathname } from "next/navigation";
import React from "react";
import Navbar from "./Navbar";

const NavbarWaper = () => {
  const pathname = usePathname();
  const isLoginPath = pathname.includes("login");
  const isRegPath = pathname.includes("register");

  if (isLoginPath || isRegPath) return null;

  return <Navbar />;
};

export default NavbarWaper;
