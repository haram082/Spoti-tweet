import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth"
import type {DefaultSession} from "next-auth"
import { env } from "~/env.mjs";
import SpotifyProvider from "next-auth/providers/spotify"
import { spotifyapi } from "./spotifyApi";


//extend session to have accestoken and refreshtoken properties
declare module "next-auth" {
    interface Session {
      user?: {
        id: string;
      } & DefaultSession["user"];
      accessToken?: string;
      refreshToken?: string;
    } 
  }

  // make login authorization url
const scopes = [
    "user-read-email",
    "playlist-read-private",
   " user-modify-playback-state",
    "playlist-read-collaborative",
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-follow-read",
    "streaming",
    "user-read-private",
    "user-modify-playback-state",
    "user-top-read",
    "user-read-playback-position",
    "user-read-recently-played",

].join(",")

const params = {
    scope: scopes
}

const LOGIN_URL = "https://accounts.spotify.com/authorize?" + new URLSearchParams(params).toString();

// refresh access token
async function refreshAccessToken(token: any) {
    try {
        spotifyapi.setAccessToken(token.accessToken)
        spotifyapi.setRefreshToken(token.refreshToken)

        const { body: refreshedToken} = await spotifyapi.refreshAccessToken()
        console.log('resfreshing')
        return{
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, 
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        }

    } catch (error) {
        console.log(error)

    }
    // const params = new URLSearchParams()
    // params.append("grant_type", "refresh_token")
    // params.append("refresh_token", token.refreshToken)
    // const response = await fetch("https://accounts.spotify.com/api/token", {
    //     method: "POST",
    //     headers: {
    //         // @ts-ignore
    //         'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64'))
    //     },
    //     body: params
    // })
    // const data = await response.json()
    // return {
    //     ...token,
    //     accessToken: data.access_token,
    //     refreshToken: data.refresh_token ?? token.refreshToken,
    //     accessTokenExpires: Date.now() + data.expires_in * 1000
    // }
}


export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: env.SPOTIFY_CLIENT_ID,
            clientSecret: env.SPOTIFY_CLIENT_SECRET,
            authorization: LOGIN_URL,
          }),
    ],
    secret: process.env.JWT_SECRET,
    // pages: {
    //     signIn: "/login",
    // },  
    callbacks: {
        async jwt({ token, account }: any) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.accessTokenExpires = account.expires_at
                return token
            }
            // access token has not expired
            if (token.accessTokenExpires && Date.now() < token.accessTokenExpires * 1000) {
                return token
            }

            // access token has expired
            return await refreshAccessToken(token)
        },
        async session({ session, token}: any) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken
            session.refresh_token = token.refreshToken
            return session
        }
    }
}


export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};


