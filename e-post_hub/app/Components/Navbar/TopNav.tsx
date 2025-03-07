"use client";

//https://nextui.org/docs/components/dropdown

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import whitman_img from "../../Images/whitman.png";
import { AiOutlineNotification } from "react-icons/ai";
import Link from "next/link";
import NavLink from "./NavLink";
import { CiLogin, CiLogout, CiUser } from "react-icons/ci";
import { GoChevronDown } from "react-icons/go";
import { GrHelpBook } from "react-icons/gr";
import { LuUserPlus } from "react-icons/lu";
import { MdOutlineCreate } from "react-icons/md";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

export default function TopNav() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // New state for user login status
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Check admin token
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt.decode(token) as { role?: string };
      if (decodedToken?.role === "ADMIN") {
        setIsAdmin(true);
        fetchPendingCount(); // Fetch pending count if user is admin
      }
      setIsUserLoggedIn(true); // Set user logged in status to true if token exists
    }
  }, []);

  // Function to fetch count of pending events
  const fetchPendingCount = async () => {
    try {
      const response = await fetch("/api/Event/pending/count");
      if (response.ok) {
        const data = await response.json();
        setPendingCount(data.count);
      } else {
        console.error("Failed to fetch pending count:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching pending count:", error);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setIsUserLoggedIn(false); // Update state
    window.location.href = "/Login"; // Redirect to the login page
  };

  return (
    <Navbar
      maxWidth="xl"
      className="w-full bg-gradient-to-r from-[#f7960d] to-[#f95d09] overflow-auto"
      classNames={{
        item: [
          "text-xl",
          "text-white",
          "uppercase",
          "data-[active=true]:text-green-400",
        ],
      }}
    >
      <NavbarBrand as={Link} href={"/"} className="flex items-center">
        <Image src={whitman_img} alt="" width={40} height={40} />
        <div className="font-bold text-3lg flex overflow-hidden">
          <span className="font-bold text-xl text-gray-800 truncate hidden md:block ml-2">
            E-Post Hub
          </span>
        </div>
      </NavbarBrand>
      <NavbarContent justify="end" className="flex items-center gap-4 ml-auto">
        {!isUserLoggedIn ? (
          <Button
            as={Link}
            href="/Login"
            variant="bordered"
            className="w-[100px] h-[30px] px-2.5 py-2 rounded-lg border border-black flex items-center justify-between gap-2 text-black hover:bg-orange-300"
          >
            <span className="text-center text-black text-small font-normal font-['Inter'] leading-none">
              Login
            </span>
            <CiLogin className="text-black" size={20} />
          </Button>
        ) : (
          <>
            <Button
              onClick={handleLogout}
              variant="bordered"
              className="w-[100px] h-[30px] px-2.5 py-2 rounded-lg border border-black flex items-center justify-between gap-2 text-black hover:bg-orange-300"
            >
              <span className="text-center text-black text-small font-normal font-['Inter'] leading-none">
                Logout
              </span>
              <CiLogout className="text-black" size={20} />
            </Button>

            <Button
              as={Link}
              href="/Event/create"
              variant="bordered"
              className="w-[140px] h-[30px] px-2.5 py-2 rounded-lg border border-black flex items-center justify-between gap-2 text-black hover:bg-orange-300"
            >
              <span className="text-center text-black text-small font-normal font-['Inter'] leading-none">
                Create Event
              </span>
              <MdOutlineCreate className="text-black" size={20} />
            </Button>
          </>
        )}

        {!isUserLoggedIn && (
          <Dropdown backdrop="blur">
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  className="w-[120px] h-[30px] px-2.5 py-2 rounded-lg border border-black flex items-center justify-between gap-2 text-black hover:bg-gray-100"
                  radius="sm"
                  variant="light"
                >
                  Register
                  <GoChevronDown />
                  <LuUserPlus size={20} />
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="e-Post registration"
              className="w-[200px]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem
                key="admin"
                as={Link}
                href="/Registeradmin"
                className="!bg-orange-500 hover:!bg-orange-300 text-black no-underline px-4 py-2 rounded-md"
              >
                Admin Registration
              </DropdownItem>

              <DropdownItem
                key="member"
                as={Link}
                href="/Registermember"
                className="!bg-orange-500 hover:!bg-orange-300 text-black no-underline px-4 py-2 rounded-md"
              >
                Member Registration
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}

        {isAdmin && (
          <div className="relative flex items-center gap-2">
            <Link href={"/Admin/creatorcode"}>
              <Button
                className="w-full h-[30px] px-2.5 py-2 rounded-lg border border-black flex items-center justify-between gap-2 text-black hover:bg-orange-300"
                variant="bordered"
              >
                <span className="text-center text-black text-small font-normal font-['Inter'] leading-none">
                  Admin Code
                </span>
                <MdOutlineAdminPanelSettings className="text-black" size={20} />
              </Button>
            </Link>

            <Link href={"/Admin/event/management"} className="relative">
              <AiOutlineNotification size={30} color="#000000" />
              {pendingCount > 0 && (
                <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-400 text-white rounded-full text-xs">
                  {pendingCount}
                </div>
              )}
            </Link>
          </div>
        )}

        {isUserLoggedIn && (
          <Link href={isAdmin ? "/Admin/profile" : "/Member/profile"}>
            <CiUser size={30} color="#000000" />
          </Link>
        )}
      </NavbarContent>
    </Navbar>
  );
}
