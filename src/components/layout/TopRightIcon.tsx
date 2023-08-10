import React from 'react'
import { useSession } from "next-auth/react";
import { api } from '~/utils/api';


const TopRightIcon = () => {
    const { data: session } = useSession()
    const {data: getUser}= api.profile.getById.useQuery()
    if(!session || !getUser) return null
  return (
    <div className="flex items-center space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full m-3 px-3 py-2 bg-green-400 text-gray-900 absolute  right-0  md:right-48 lg:right-72 z-40">
        {session?.user?.image && <img src={getUser.image!} alt="pfp" width={30} height={30}
        className=" rounded-2xl"></img>}
            <h2 className='hidden md:inline text-black'>Welcome, {getUser.name}</h2>
            </div>
  )
}

export default TopRightIcon
