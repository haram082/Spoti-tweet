import React, { useEffect, useState } from 'react'
import { signIn, useSession } from "next-auth/react";
import { PageLayout } from '~/components/layout';
import useSpodify from '~/hooks/useSpodify';
import { useRecoilState } from 'recoil';
import Link from 'next/link';




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
    <div className='flex justify-center items-center text-3xl'> 
       <button onClick={() =>  signIn("spotify")}>Sign In to See Data</button>
     </div>)
  return (
    <PageLayout>
    <div className=''>
        <h1>{session.user.name}'s Library</h1> 
        <ul className='flex justify-evenly flex-wrap space-y-5 space-x-5'>
        {playlists.map((playlist) =>(
          <Link href={`/playlist/${playlist.id}`} key={playlist.id}
          className='flex flex-col text-center items-center border cursor-pointer'>
          <img src={playlist.images[0].url} alt="song" width={150} height={150} className=' object-contain'></img>
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
