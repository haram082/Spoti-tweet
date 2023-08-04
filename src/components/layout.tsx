import type { PropsWithChildren } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { currentTrackIdState } from '~/atom/songAtom'
import { useRecoilState } from "recoil";
import useSpodify from "~/hooks/useSpodify";
import { useEffect } from "react";
import useSongInfo from "~/hooks/useSongInfo";
import Stats from "./Stats";
import Player from "./Player";


export const Sidebar = () => {
    const { data: session } = useSession();
    return (
        <ul className="text-center flex flex-col justify-center items-center gap-3 mt-5 text-slate-600 ">
            <Link href="/" className="flex gap-3 hover:text-slate-100 hover:underline">Home</Link>
            <Link href="/search" className="hover:text-slate-100 hover:underline">Music</Link>
            {session && <><Link href="/playlists" className="hover:text-slate-100 hover:underline">Library</Link>
            <Link href={`/profile/@${session.user?.name}`} className="hover:text-slate-100 hover:underline">Profile</Link></>}
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
    const [currentTrack, setCurrentTrack] = useRecoilState<any>(currentTrackIdState)
    const { data: session } = useSession();
    const spotify = useSpodify()
    const songInfo = useSongInfo()

    useEffect(() => {
        if(spotify.getAccessToken() && !currentTrack){
            if(!songInfo){
                spotify.getMyCurrentPlayingTrack().then((data) => {
                    setCurrentTrack(data.body?.item?.id)  
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
      <div className="hidden md:block text-center w-1/4 "> 
            <Stats/>
        </div>
        
    </main>
       {currentTrack && <Player/>}
    
    </>
    ) 
}

