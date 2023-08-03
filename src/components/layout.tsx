import { PropsWithChildren } from "react";
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
        <ul className="text-center flex flex-col justify-center items-center gap-3 mt-5 text-slate-600 hover:text-slate-100">
            <Link href="/" className="flex gap-3">Home</Link>
            <li>Music</li>
            {session && <><Link href="/playlists">Library</Link>
            <Link href={`/`}>Profile</Link></>}
            <li>
            <button
                className="rounded-full bg-white/10 px-10 font-semibold no-underline transition hover:bg-white/20"
                onClick={session ? () => void signOut() : () =>  signIn("spotify")}>
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
      <div className="flex flex-col items-center text-center w-1/4"> 
            <Stats/>
        </div>
        
    </main>
       {currentTrack && <Player/>}
    
    </>
    ) 
}

