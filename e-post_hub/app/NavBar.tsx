import React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import icon from './icon.png';

const NavBar = () => {
  return (
    <nav className='flex space-x-6 border-b mb-5 px-5 h-20 items-center'>
        <Image src={icon} alt = "The whitman county logo" width = {70} height = {70} />
        <ul className='flex space-x-6'>
            <li><Link href="/">Homepage</Link></li>
            <li><Link href="/">Login</Link> </li>
            <li><Link href="/">Edit Profile</Link> </li>
            <li><Link href="/">Report an Issue</Link> </li>
        </ul> 
    </nav>
  )
}

export default NavBar