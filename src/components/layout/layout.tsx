import type { PropsWithChildren } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { currentTrackIdState,isPlayingState } from '~/atom/songAtom'
import { useRecoilState } from "recoil";
import useSpodify from "~/hooks/useSpodify";
import { useEffect } from "react";
import useSongInfo from "~/hooks/useSongInfo";
import Stats from "./Stats";
import Player from "./Player";
import { api } from "~/utils/api";


export const Sidebar = () => {
    const { data: session } = useSession();
    // const {data: getUser}= api.profile.getProfile.useQuery();
  
    
    // if(!getUser) {
    //     const {mutate} = api.profile.createProfile.useMutation({
    //     onSuccess: (data)=> {
    //         console.log(data)
    //     }
    // })
    // const m = () => mutate({ name: session?.user?.name!, image: session?.user?.image!, email: session?.user?.email!, })
    // m()
    // }
    
  
    return (
        <ul className="text-center flex flex-col justify-center items-center gap-3 mt-5 text-slate-600 ">
            <Link href="/" className="flex gap-3 hover:text-slate-100 hover:underline">Home</Link>
            {session && <> <Link href="/search" className="hover:text-slate-100 hover:underline">Music</Link>
             <Link href="/playlists" className="hover:text-slate-100 hover:underline">Library</Link>
            <Link href={`@${getEmailBody(session.user?.email!)}`} className="hover:text-slate-100 hover:underline">Profile</Link></>}
            <li>
            <button
                className="rounded-xl bg-white/10 py-1 px-3 font-semibold transition text-white"
                onClick={session ? () => void signOut().then(
                    () => window.location.href = "/"
                ) : () => void signIn("spotify")}>
                {session ? "Sign out" : "Sign in"}
            </button>
            </li>
        </ul>
    )
}



export const PageLayout = (props: PropsWithChildren)=>{
    const [currentTrack, setCurrentTrack] = useRecoilState<string |null>(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState<boolean>(isPlayingState)
    const { data: session } = useSession();
    const spotify = useSpodify()
    const songInfo = useSongInfo()

    useEffect(() => {
        if(spotify.getAccessToken() && !currentTrack){
            if(!songInfo){
                spotify.getMyCurrentPlayingTrack().then((data) => {
                    if(data.body?.item?.id) setCurrentTrack(data.body?.item?.id) 
                    setIsPlaying(data.body?.is_playing); 
                })
            }
        }
    }, [spotify, session, currentTrackIdState])
    
    return(
    <>
    <main className="flex h-screen bg-dark">
        <div className="sidebar-container h-full w-1/5 border-r border-slate-400">
            <Sidebar/>
        </div>
        <div className="feed-container h-full w-full  border-x border-slate-400 overflow-y-scroll  overflow-hidden">
            {props.children}
      </div>
      <div className="hidden md:block w-1/3 "> 
            <Stats/>
        </div>
        
    </main>
       {currentTrack && <Player/>}
    
    </>
    ) 
}

function getEmailBody(email: string): string {
    const [body]  = email.split('@')
    if(body) return body
    return email
  }