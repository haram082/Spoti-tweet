import { PropsWithChildren } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export const Sidebar = () => {
    const { data: session } = useSession();
    return (
        <ul className="text-center flex flex-col gap-3 ml-5">
            <Link href="/">Home</Link>
            <li>Music</li>
            {session && <><Link href="/library">Library</Link>
            <Link href={`/@${session.user?.name}`}>Profile</Link></>}
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
    return(
    <main className="flex h-screen bg-dark">
        <div className="sidebar-container h-full w-[200px] border-r border-slate-400">
            <Sidebar/>
        </div>
        <div className="feed-container h-full w-full md:max-w-2xl border-x border-slate-400 overflow-y-scroll  overflow-hidden">
            {props.children}
      </div>
     
    </main>
    ) 
}

