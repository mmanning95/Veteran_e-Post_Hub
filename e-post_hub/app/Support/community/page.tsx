'use client'
import { Button } from '@nextui-org/react'
import React from 'react'

export default function CommunityPage() {
  return (
    <div>
      Community Questions page
      <div>
      <Button
        className="bg-orange-400 text-white mt-4"
        onClick={() => (window.location.href = '/Support/community/ask')}
      >
        Ask a question
      </Button>
      </div>
    </div>

    
  )
}
