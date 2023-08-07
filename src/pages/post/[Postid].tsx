import React from 'react'
import type { NextPage } from 'next'
import {useRouter} from 'next/router'
import { useSession } from 'next-auth/react'

const Post:NextPage = () => {
    const {data: session}= useSession()
    const router = useRouter()
    const {Postid} = router.query
    return (
        
        <div>
            {session?.user?.name}: {Postid}
        </div>
  )
}

export default  Post
