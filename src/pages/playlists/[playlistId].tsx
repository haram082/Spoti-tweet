import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
import { shuffle } from 'lodash';
import useSpodify from '~/hooks/useSpodify';
import type {NextPage} from 'next';
import { useRouter } from 'next/router';
import { PageLayout } from '~/Components/layout';
import Songs from '~/Components/Songs';
import TopRightIcon from '~/Components/TopRightIcon';;
import BackArrow from '~/Components/BackArrow';


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

const Playlist: NextPage = () => {
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
        const {playlistId} = router.query
        if(session && typeof playlistId === 'string'){
        spotify.getPlaylist(playlistId).then((data) => {
            setPlaylist(data.body)
        }).catch((err: Error) => {
            console.log(err)
        })}
    }, [spotify, session, router])

     
  return (
    <PageLayout>
      <TopRightIcon />
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80`}>

            <div className='mt-5 ml-5 space-y-24'>  
            <BackArrow />
      
            <img src={playlist?.images[0].url} alt="album_cover" 
            className='h-44 w-44 shadow-2xl'/>
            </div>

            <div>
                <p>PLAYLIST</p>
                <h2 className='text-2xl md:text-3xl xl:text-5xl font-semibold max-w-lg'>{playlist?.name}</h2>
            </div>
            </section>

            <Songs playlist ={playlist} album={false} albumImage={null} albumName={null}/>
    </PageLayout>
  )
}

export default Playlist
