import React from 'react'
import { useSession } from "next-auth/react";

const TopRightIcon = () => {
    const { data: session } = useSession()
  return (
    <div className="flex items-center space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full m-3 px-3 py-2 bg-green-400 text-gray-900 absolute right-56 z-40">
        {session?.user?.image && <img src={session?.user?.image} alt="pfp" width={30} height={30}
        className=" rounded-2xl"></img>}
            <h2>Welcome, {session?.user?.name}</h2>
            </div>
  )
}

export default TopRightIcon
