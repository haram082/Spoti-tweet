import React from 'react'
import { PageLayout } from '~/Components/layout'
import type {NextPage} from 'next'
import { useSession } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import {HiOutlineMagnifyingGlass} from 'react-icons/hi2'
import FeaturedPlaylists  from '~/Components/FeaturedPlaylists'
import SearchResults  from '~/Components/SearchResults'
import TopRightIcon from '~/Components/TopRightIcon'



const Search: NextPage = () => {  
  const {data: session} = useSession()
  const [inputValue, setInputValue] = useState<string>('')
  const [searchData, setSearchData] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function updateSearchResults(query: string) {
    if (session){
    const response = await fetch("https://api.spotify.com/v1/search?" + new URLSearchParams({
        q: query,
        type: ["artist", "album", "track", "playlist"].join(","),
        limit: "4",
    }), {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        }
    })
    const data = await response.json()
    setSearchData(data)}
}

useEffect(() => {
  if (inputRef.current) inputRef.current.focus()
}, [inputRef])

  return (
    <PageLayout>
         <div className='flex-grow pb-24'>
            <TopRightIcon/>
            <header className='text-white sticky top-0 h-20 z-10 text-4xl flex items-center px-8'>
             
                <HiOutlineMagnifyingGlass className='absolute top-7 left-10 h-6 w-6 text-neutral-800' />
                <input value={inputValue} onChange={async (e) => {
                    setInputValue(e.target.value)
                    if (e.target.value === '') setSearchData(null)
                    else await updateSearchResults(e.target.value)
                }} ref={inputRef} className='rounded-full bg-white w-96 pl-12 text-neutral-900 text-base py-2 font-normal outline-0' />
            </header>
            <div>
                {searchData === null ? <FeaturedPlaylists
                /> : <SearchResults
                    playlists={searchData?.playlists.items}
                    songs={searchData?.tracks.items}
                    artists={searchData?.artists.items}
                    albums={searchData?.albums.items}
                />}
            </div>
        </div>
    </PageLayout>
  )
}

export default Search
