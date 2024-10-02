import Link from 'next/link'
import React from 'react'

export default function Adminpage() {
  return (
    <div>
        <h3 className= 'text-3xl'>This will be the admin page</h3>
        <Link href='/'>Go back home</Link>
    </div>
  )
}
