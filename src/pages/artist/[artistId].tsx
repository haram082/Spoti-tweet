import React from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { PageLayout } from '~/components/layout';
import { useSession } from "next-auth/react";
import useSpodify from '~/hooks/useSpodify';
import { useEffect, useState } from 'react';
import TopRightIcon from '~/components/TopRightIcon';
import BackArrow from '~/components/BackArrow';
import { shuffle } from 'lodash';
import Song from '~/components/Song';
import Link from 'next/link'
import AlbumView from '~/components/AlbumView';


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

const Artist: NextPage = () => {
    const router = useRouter()
    const {artistId} = router.query
    const { data: session } = useSession()
    const spotify = useSpodify()
    const [artist, setArtist] = useState<any>(null)
    const [topTracks, setTopTracks] = useState<any>(null)
    const [relatedArtists, setRelatedArtists] = useState<any>(null)
    const [albums, setAlbums] = useState<any>(null)
    const [color, setColor] = useState("from-green-100");

    useEffect(() => {
      // @ts-ignore
      setColor(shuffle(colors).pop())
        }, []);

    useEffect(() => {
      const {artistId} = router.query
      if(session && typeof artistId === 'string'){
      spotify.getArtist(artistId).then((data) => {
          setArtist(data.body)
      }).catch((err: Error) => {
          console.log(err)
      })

      spotify.getArtistTopTracks(artistId, 'US').then((data) => {
        setTopTracks(data.body.tracks)
      }).catch((err: Error) => {
          console.log(err)
      })

      spotify.getArtistAlbums(artistId).then((data) => {
        setAlbums(data.body.items)
      }).catch((err: Error) => {
          console.log(err)
      })
      
      spotify.getArtistRelatedArtists(artistId).then((data) => {
        setRelatedArtists(data.body.artists.slice(0,6))
      }).catch((err: Error) => {
          console.log(err)
      })

    }

  }, [spotify, session, router])

    
  return (
    <PageLayout>
      <TopRightIcon/>
      <div className='pb-24'>
      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80`}>

            <div className='mt-5 ml-5 space-y-24'>  
            <BackArrow />
      
            <img src={artist?.images[0].url} alt="album_cover" 
            className='h-44 w-44 shadow-2xl'/>
            </div>

            <div>
                <p>ARTIST</p> 
                <h2 className='text-2xl md:text-3xl xl:text-5xl font-semibold max-w-lg pb-3'>{artist?.name}</h2>
                <p>{artist?.followers?.total.toLocaleString()} followers</p>
                <div className='text-sm text-slate-400'>Genres: {artist?.genres.join(", ")}</div>
            </div>
            
            </section>
            

            <section className='mt-16 ml-8'>
                <h2 className='text-2xl md:text-3xl font-semibold'>Popular</h2>
                <div className='px-8 flex flex-col space-y-1 mt-5'>
                  {topTracks?.map((track: any, i:number) => (
                    <Song key={track.id} track={track} order={i} 
                    album={true} albumImage={null} albumName={null}/>

                  ))}
    </div>
            </section>

            <section className='mt-16 '>
                <div className='flex flex-wrap justify-evenly gap-1 mx-8 mt-4'>
            {
                albums?.map((album:any) => (
                    <AlbumView key={album.id} playlist={album} />
                ))
            }
            </div>
            </section>

            <section className='mt-16 '>
                <h2 className='text-2xl md:text-3xl  font-semibold ml-8'>Fans Also Like</h2>
                <div className='flex flex-wrap justify-evenly gap-1 mx-8 mt-4'>
            {
                relatedArtists?.map((artist:any) => (
                    <Link href={`/artist/${artist.id}`} className='flex flex-col p-5 shadow border rounded-lg gap-3 hover:bg-gray-900' key={artist.id}>
                        <img src={artist?.images?.[0]?.url} alt={artist.name} className='h-40 w-40 rounded-full'/>
                        <p className='text-slate-50 text-center hover:underline font-bold'>{artist.name}</p>
                    </Link>
                ))
            }
            </div>
            </section>
              
      </div>

    </PageLayout>
  )
}

export default Artist
