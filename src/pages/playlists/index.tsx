import React, { useEffect, useState } from 'react'
import { signIn, useSession } from "next-auth/react";
import { PageLayout } from '~/components/layout/layout';
import useSpodify from '~/hooks/useSpodify';
import icon from "../../../public/icon.png";
import TopRightIcon from '~/components/layout/TopRightIcon';
import BackArrow from '~/components/layout/BackArrow';
import type {NextPage} from 'next';
import AlbumView from '~/components/music/AlbumView';
import Head from 'next/head';


const Playlists: NextPage = () => {
    const spotify = useSpodify()
    const { data: session } = useSession();
    const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([])

  useEffect(() => {
    if(spotify.getAccessToken()){
      spotify.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items)
        
      })
    }
  }, [session,spotify])

  if (!session || !session.user) return(
    <PageLayout>
    <div className='flex justify-center items-center text-3xl'> 
       <button onClick={() => void signIn("spotify")}
       className=' rounded-lg px-6 pb-2 pt-2.5 mt-16 font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-black focus:text-primary-600 focus:outline-none focus:ring-0 flex flex-row">'>Sign In to See Data 
      <img src={icon.src} alt="" className='w-12 h-12 ml-3'/></button>
     </div>
     </PageLayout>)

  return (
    <PageLayout>
       <Head>
        <title>Library</title>
        </Head>
      <TopRightIcon/>
    <div className='pb-24'>
      <div className='mt-5 ml-5'><BackArrow/></div>
        <div className='text-center text-2xl font-bold mb-2'>{session.user.name}&apos;s Library</div> 
        
        <ul className='flex flex-wrap justify-evenly'>
        {playlists.map((playlist: SpotifyApi.PlaylistObjectSimplified) =>(
          <AlbumView playlist={playlist} key={playlist.id} album={false}/>
        )          
        )}
        </ul>
      
    </div>
    </PageLayout>
  )
}

export default Playlists
