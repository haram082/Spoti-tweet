import React, { useEffect, useState } from 'react'
import { signIn, useSession } from "next-auth/react";
import { PageLayout } from '~/components/layout';
import useSpodify from '~/hooks/useSpodify';
import Link from 'next/link';
import icon from "../../../public/icon.png";
import TopRightIcon from '~/components/TopRightIcon';
import {MdArrowBackIosNew} from 'react-icons/md';



const library = () => {
    const spotify = useSpodify()
    const { data: session } = useSession();
    const [playlists, setPlaylists] = useState<any[]>([])

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
       <button onClick={() =>  signIn("spotify")}
       className=' rounded-lg px-6 pb-2 pt-2.5 mt-16 font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-black focus:text-primary-600 focus:outline-none focus:ring-0 flex flex-row">'>Sign In to See Data 
      <img src={icon.src} alt="" className='w-12 h-12 ml-3'/></button>
     </div>
     </PageLayout>)
  return (
    <PageLayout>
    <div className='pb-24'>
      <TopRightIcon/>
      <div className='mt-5 ml-5'>  
        <Link href="../"><MdArrowBackIosNew className='inline-block text-3xl text-slate-200 hover:text-slate-400 cursor-pointer'/> Back</Link></div>

        <div className='text-center text-2xl font-bold mb-2'>{session.user.name}'s Library</div> 
        <ul className='flex flex-wrap justify-evenly'>
        {playlists.map((playlist) =>(
          <Link href={`/playlists/${playlist.id}`} key={playlist.id}
          className='flex flex-col text-center items-center justify-center cursor-pointer h-[200px] w-[200px] hover:bg-slate-800 rounded-lg'>
          <img src={playlist.images[0].url} alt="song" width={150} height={150} className=' object-cover p-2'></img>
          <p key={playlist.id}>{playlist.name}</p>
          </Link>
        )          
        )}
        </ul>
      
    </div>
    </PageLayout>
  )
}

export default library
