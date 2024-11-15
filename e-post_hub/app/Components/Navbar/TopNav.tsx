'use client'

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import whitman_img from "../../Images/whitman.png"
import { AiOutlineNotification } from "react-icons/ai";
import Link from 'next/link'
import NavLink from './NavLink'

export default function TopNav() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        // Check admin token
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwt.decode(token) as { role?: string };
          if (decodedToken?.role === 'ADMIN') {
            setIsAdmin(true);
            fetchPendingCount(); // Fetch pending count if user is admin
          }
        }
      }, []);

    // Function to fetch count of pending events
    const fetchPendingCount = async () => {
      try {
        const response = await fetch('/api/Event/pending/count');
        if (response.ok) {
          const data = await response.json();
          setPendingCount(data.count);
        } else {
          console.error('Failed to fetch pending count:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching pending count:', error);
      }
    };

    return (
      <Navbar maxWidth='xl' className='bg-gradient-to-r from-orange-400 to bg-orange-600'
          classNames={{item: [
                                  'text-xl',
                                  'text-white',
                                  'uppercase',
                                  'data-[active=true]:text-green-400']}}
          > 
          <NavbarBrand as={Link} href={"/"}>
              <Image src={whitman_img} alt="" width={40} height={40} />
              <div className='font-bold text-3lg flex'>
                  <span className='text-gray-800'>Veteran e-Post Hub</span>
              </div>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <Dropdown>
              <NavbarItem>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="p-0 bg-transparent data-[hover=true]:bg-orange-500 border-2 border-gray-500"
                    radius="sm"
                    variant="light"
                  >
                    Help & Support
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
              aria-label="e-Post Help"
              className="w-[340px]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem className="!bg-orange-500 hover:!bg-orange-300 text-white">
                <Link href = "./" className='text-black no-underline'>
                  External Resources
                </Link>
              </DropdownItem>
              <DropdownItem className="!bg-orange-500 hover:!bg-orange-300 text-white">
                <Link href = "./" className='text-black no-underline'>
                  Community Questions
                </Link>
              </DropdownItem>
              <DropdownItem className="!bg-orange-500 hover:!bg-orange-300 text-white">
                <Link href = "./" className='text-black no-underline'>
                  Report a Problem
                </Link>
              </DropdownItem>
            </DropdownMenu> 
            </Dropdown>
              <div className='relative'>
              {isAdmin && (
                  <Link href={'/Admin/event/management'}>
                      <AiOutlineNotification size={30} color='#4B5563' />
                      {pendingCount > 0 && (
                        <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-400 text-white rounded-full text-xs'>
                          {pendingCount}
                        </div>
                      )}
                  </Link>
              )} </div>
          </NavbarContent>
          <NavbarContent justify='end'>
              <Button as={Link} href='/Login' variant='bordered' className='text-white'>Login</Button>
              <Button as={Link} href='/Registeradmin' variant='bordered' className='text-white'>Register Admin</Button>
              <Button as={Link} href='/Registermember' variant='bordered' className='text-white'>Register Member</Button>
          </NavbarContent>
      </Navbar>
    )
}
