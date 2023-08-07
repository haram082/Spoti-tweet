import React, { useEffect, useState } from 'react'
import useSpodify from '~/hooks/useSpodify'
import { useSession } from 'next-auth/react'
import AlbumView from '../music/AlbumView'

const FeaturedPlaylists = () => {
    const spotify = useSpodify()
    const [featuredPlaylists, setFeaturedPlaylist] = useState<SpotifyApi.PlaylistObjectSimplified[]>([])
    useEffect(() => {
        spotify.getFeaturedPlaylists({ limit : 8, offset: 1, country: 'US' })
        .then((data) => {
            setFeaturedPlaylist(data.body.playlists.items)
        })
    }, [spotify])
  return (
    <>
    <div className='text-center text-2xl font-bold mb-2 p-2 text-slate-200'>Featured Playlists In the US</div>
    <div className='flex flex-wrap justify-evenly'>
      {
            featuredPlaylists.map((playlist) => (
                <AlbumView playlist={playlist} key={playlist.id}/>
            ))
      }
    </div>
    </>
  )
}

export default FeaturedPlaylists
