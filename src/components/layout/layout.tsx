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
import {HiHome} from 'react-icons/hi'
import {TbWorldSearch} from 'react-icons/tb'
import {MdLibraryMusic} from 'react-icons/md'
import {VscSignOut} from 'react-icons/vsc'
import { useState } from "react";
import { InitialModal } from "../InitialModal";
import { open } from "~/atom/songAtom";

export const Sidebar = () => {
    const { data: session } = useSession();
    const {data: getUser, isLoading}= api.profile.getById.useQuery();
    const [modalOpen, setmodalOpen] = useRecoilState<boolean>(open)

    const {mutate} = api.profile.createProfile.useMutation({
        onSuccess: (data)=> {
            console.log(data)
                },
        onError: (err)=> {
            console.log(err)
        }
        })
    useEffect(() =>   {
        if(!isLoading){
            if(session && !getUser ) {
            mutate({ name: session.user?.name!, image: session.user?.image! , email: session.user?.email! })
            }
        }
      }, [getUser, isLoading, session])
  
    return (
        <ul className="text-center flex flex-col justify-center items-center gap-5 mt-5 text-slate-600 ">
            <Link href="/" className="flex gap-3 hover:text-slate-100 hover:underline items-center text-xl"><HiHome className="text-3xl lg:text-2xl"/><span className="hidden lg:inline">Home</span></Link>
            {session && <> <Link href="/search" className="flex gap-3 hover:text-slate-100 hover:underline items-center text-xl"><TbWorldSearch className="text-3xl lg:text-2xl"/><span className="hidden lg:inline">Music</span></Link>
             <Link href="/playlists" className="flex gap-3 hover:text-slate-100 hover:underline items-center text-xl"><MdLibraryMusic className="text-3xl lg:text-2xl"/><span className="hidden lg:inline">Library</span></Link>
            <Link href={`/@${getUser?.username}`} className="flex gap-3 hover:text-slate-100 hover:underline text-xl"><img src={session.user?.image!} alt="pfp" className=" rounded-full h-7 w-7 shadow-md text-3xl lg:text-xl" /><span className="hidden lg:inline">Profile</span></Link></>}
            <li>
            <button
                className="rounded-xl bg-white/10 py-1 px-3 font-semibold transition text-white flex items-center gap-2 text-xl"
                onClick={session ? () => void signOut().then(
                    () => window.location.href = "/"
                ) : () =>  void signIn("spotify").then()}>
                <VscSignOut className="text-3xl lg:text-2xl"/>
                <span className="hidden lg:inline">{session ? "Sign out" : "Sign in"}</span>
            </button>
            </li>
            { modalOpen && !session && <InitialModal handleClose={()=>setmodalOpen(false)} />}
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
