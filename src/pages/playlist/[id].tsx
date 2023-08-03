import React, { use, useEffect, useState } from 'react'
import icon from "../../../public/icon.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { shuffle } from 'lodash';
import useSpodify from '~/hooks/useSpodify';
import type {NextPage} from 'next';
import { useRouter } from 'next/router';
import { PageLayout } from '~/components/layout';
import Songs from '~/components/Songs';


const colors: string[] = [
    "from-indigo-500",
    "from-blue-500",
    "from-lightBlue-500",
    "from-cyan-500",
    "from-emerald-500",
    "from-teal-500",
    "from-green-500",
    "from-lime-500",
    "from-yellow-500",
    "from-amber-500",
    "from-orange-500",
    "from-red-500",
    "from-pink-500",        
    "from-purple-500"
    ];

const AlbumView: NextPage = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const {id} = router.query
    
    const [color, setColor] = useState("from-green-100");
    
    useEffect(() => {
        // @ts-ignore
        setColor(shuffle(colors).pop())
    }, [])

    
    const spotify = useSpodify()
    const [playlist, setPlaylist] = useState<any>(null)
    
    useEffect(() => {
        if(session && typeof id === 'string'){
        spotify.getPlaylist(id).then((data) => {
            setPlaylist(data.body)
        }).catch((err) => {
            console.log(err)
        })}
    }, [spotify, id])

     
  return (
    <PageLayout>
      <div className="flex items-center space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full m-3 px-3 py-1  bg-slate-100 text-gray-900 absolute right-56">
            <Image src={icon.src} alt="pfp" width={40} height={40}></Image>
            <h2>Welcome, {session?.user?.name}</h2>
            </div>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80`}>
            <img src={playlist?.images[0].url} alt="album_cover" 
            className='h-44 w-44 shadow-2xl'/>
            <div>
                <p>PLAYLIST</p>
                <h2 className='text-2xl md:text-3xl xl:text-5xl font-semibold'>{playlist?.name}</h2>
            </div>
            </section>

            <Songs playlist ={playlist}/>
    </PageLayout>
  )
}

export default AlbumView
