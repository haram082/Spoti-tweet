import SpotifyApi from "spotify-web-api-node"
import { env } from "~/env.mjs";

export const spotifyapi = new SpotifyApi({
    clientId: env.SPOTIFY_CLIENT_ID,
    clientSecret: env.SPOTIFY_CLIENT_SECRET,
    redirectUri: env.SPOTIFY_REDIRECT_URI,
})