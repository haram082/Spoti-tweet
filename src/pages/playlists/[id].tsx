import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
import { shuffle } from 'lodash';
import useSpodify from '~/hooks/useSpodify';
import type {NextPage} from 'next';
import { useRouter } from 'next/router';
import { PageLayout } from '~/components/layout';
import Songs from '~/components/Songs';
import TopRightIcon from '~/components/TopRightIcon';
import {MdArrowBackIosNew} from 'react-icons/md';
import Link from 'next/link';


const colors: string[] = [
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
    
    const [color, setColor] = useState("from-green-100");
    
    useEffect(() => {
        // @ts-ignore
        setColor(shuffle(colors).pop())
          }, []);

    
    const spotify = useSpodify()
    const [playlist, setPlaylist] = useState<any>(null)
    
    useEffect(() => {
        const {id} = router.query
        if(session && typeof id === 'string'){
        spotify.getPlaylist(id).then((data) => {
            setPlaylist(data.body)
        }).catch((err) => {
            console.log(err)
        })}
    }, [spotify, session, router])

     
  return (
    <PageLayout>
      <TopRightIcon />
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80`}>

            <div className='mt-5 ml-5 space-y-24'>  
        <Link href="/playlists"><MdArrowBackIosNew className='inline-block text-3xl text-slate-200 hover:text-slate-400 cursor-pointer'/> Back</Link>
      
            <img src={playlist?.images[0].url} alt="album_cover" 
            className='h-44 w-44 shadow-2xl'/>
            </div>

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
