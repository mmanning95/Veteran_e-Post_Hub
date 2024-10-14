import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import Image from 'next/image'
import React from 'react'
import { GiMatchTip } from 'react-icons/gi'
import whitman_img from "../../Images/whitman.png"
import Link from 'next/link'
import NavLink from './NavLink'

export default function TopNav() {
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
        <NavbarContent justify= 'center'>
            <NavLink href={'/fakelink'} label='add_links_here' />
        </NavbarContent>
        <NavbarContent justify='end'>
            <Button as={Link} href='/Login' variant='bordered' className='text-white'>Login</Button>
            <Button as={Link} href='/Registeradmin' variant='bordered' className='text-white'>Register Admin</Button>
            <Button as={Link} href='/Registermember' variant='bordered' className='text-white'>Register Member</Button>
        </NavbarContent>
    </Navbar>
  )
}
