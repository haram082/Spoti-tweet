import React, { useEffect } from 'react'
import {useSession} from 'next-auth/react'
import SpotifyApi from "spotify-web-api-node"
import { signIn } from 'next-auth/react'

export const spotifyapi = new SpotifyApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
})


const useSpodify = () => {
  const {data: session} = useSession()
  useEffect(() => {
    if(session?.accessToken){
        spotifyapi.setAccessToken(session.accessToken)
    }
  }, [session])

  return spotifyapi
}

export default useSpodify
