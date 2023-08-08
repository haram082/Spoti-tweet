import React from 'react'
import {BsPlayFill} from 'react-icons/bs'
import Link from 'next/link'
import { spotifyapi } from '~/hooks/useSpodify'

const AlbumView = (props:{playlist:SpotifyApi.PlaylistObjectSimplified | SpotifyApi.AlbumObjectSimplified, album: boolean}) => {
    const {playlist, album} = props

    
  return (
    <Link href={`/${album ? 'albums': 'playlists'}/${playlist.id}`} key={playlist.id}
          className='flex flex-col text-center items-center justify-center cursor-pointer h-[250px] w-[200px] hover:bg-slate-800 rounded-xl relative group'>

              <div className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 shadow-2xl shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500  group-hover:top-[130px] right-6'>
              <BsPlayFill className='h-6 w-6 ' />
                </div>
          <img src={playlist.images[0]?.url} alt="song" width={150} height={150} className=' object-cover p-2'></img>
          <p key={playlist.id}>{playlist.name}</p>
          </Link>
  )
}

export default AlbumView
