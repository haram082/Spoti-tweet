import React, { useEffect } from 'react'
import useSpodify from '~/hooks/useSpodify'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

const Stats = () => {
  const { data: session } = useSession()
  const [topArtistsShort, setTopArtistsShort] = useState<SpotifyApi.ArtistObjectFull[] | []>([]);
  const [topArtistsLong, setTopArtistsLong] = useState<SpotifyApi.ArtistObjectFull[] | [] >([]);
  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[] | []>([]);
  const [trendingTracks, setTrendingTracks] = useState<SpotifyApi.PlaylistTrackObject[]| []>([]);
  const spotify = useSpodify()
  useEffect(() => {
    if(session){
    spotify.getMyTopArtists({limit: 5, time_range: "short_term" }).then((data) => {
      setTopArtistsShort(data.body.items)
    })
    spotify.getMyTopArtists({limit: 5, time_range: "medium_term" }).then((data) => {
      setTopArtistsLong(data.body.items)
    })
    spotify.getMyTopTracks({limit: 5,  time_range: "short_term"}).then((data) => {
      setTopTracks(data.body.items)
    })
    spotify.getPlaylistTracks('37i9dQZEVXbNG2KDcFcKOF', { limit : 5 }).then((data) => {
      setTrendingTracks(data.body.items)
    })
  }

  }, [session, spotify])
  if(!session) return <div className='text-center'>Sign In to See Stats</div>
  return (
    <div className='flex flex-col'>
      <h1 className='text-center text-xl font-bold'>Spotify Stats</h1>

      <section className='grid grid-cols-2 space-x-2 border-y'>
        
        <div className='flex flex-col border-r pb-3'>
        <p className="text-base font-bold border-b text-center text-slate-400">Your Top Tracks</p>
        {
          topTracks.map((track: SpotifyApi.TrackObjectFull, i: number) => (
            <div key={track.id} className='flex pl-3 pt-1'>
              <p className='text-slate-200 px-1'>{i+1}. </p>
              <div>
              <Link href={`/albums/${track?.album.id}`}><p className='text-slate-200 hover:underline text-sm truncate w-24'> {track?.name}</p></Link>

              <Link href={`/artist/${track?.artists[0]?.id}`}><p className='text-xs text-slate-300 hover:underline cursor-pointer'>{track?.artists[0]?.name}</p></Link>
              </div>
            </div>
          ))
        }
      </div>
      <div className='flex flex-col border-l border-r'>
        <p className="text-base font-bold border-b text-center text-slate-400 ">Trending Tracks</p>
        {
          trendingTracks.map((track: SpotifyApi.PlaylistTrackObject, i: number) => (
            <div key={i+1} className='flex'>
              <p className='text-slate-200 px-1'>{i+1}. </p>
              <div>
              <Link href={`/albums/${track?.track?.album?.id}`}><p className='text-slate-200 text-sm hover:underline truncate w-24'> {track?.track?.name}</p></Link>

              <Link href={`/artist/${track?.track?.artists[0]?.id}`}><p className='text-xs text-slate-300 hover:underline cursor-pointer'>{track?.track?.artists[0]?.name}</p></Link>
              </div>
            </div>
          ))
        }
        </div>
      </section>

      <section>
      <p className="text-lg font-semibold text-center border-b  text-slate-400">Your Top Artists</p>
      <div className='flex flex-col pb-2 border-b'>
        <div className='flex  border-b'>
          <p className='w-1/2 text-center font-semibold'>1 Month</p>
          <p className='w-1/2 text-center font-semibold'>6 Months</p>
        </div>

        <div className='flex'>
        <div className='w-1/2'>
        {
          topArtistsShort.map((artist: SpotifyApi.ArtistObjectFull, i: number) => (
            <div key={artist.id} className='flex pl-3 '>
              <p className='text-slate-200 px-1'>{i+1}. </p>
              <div>
              <Link href={`/artist/${artist?.id}`}><p className='text-slate-200 text-sm hover:underline'> {artist?.name}</p></Link>
              <p className='text-xs text-slate-300'>{artist?.genres[0]}</p>
              </div>
            </div>
          ))
        }
      </div>
      <div className='w-1/2'>
        {
          topArtistsLong.map((artist: SpotifyApi.ArtistObjectFull, i: number) => (
            <div key={artist.id} className='flex border-l pl-4'>
              <p className='text-slate-200 px-1'>{i+1}. </p>
              <div>
              <Link href={`/artist/${artist?.id}`}><p className='text-slate-200 text-sm hover:underline'> {artist?.name}</p></Link>
              <p className='text-xs text-slate-300'>{artist?.genres[0]}</p>
              </div>
            </div>
          ))
        }
        </div>
      </div>
      </div>
      </section>

    </div>
  )
}

export default Stats
