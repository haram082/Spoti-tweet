import { motion, AnimatePresence } from "framer-motion"
import React, { useState } from "react"
import icon from ".././../public/icon.png"

type ModalProps = {
	handleClose: () => void
}
const Backdrop = ({children, onClick}) => {
    return (
      <motion.div onClick={onClick}
      className='absolute top-0 left-0 w-full h-full bg-blue-300 bg-opacity-50 z-50 flex justify-center items-center' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
           {children}
      </motion.div>
    )
}

export const InitialModal = ({ handleClose }: ModalProps) => {
  	return (
        <Backdrop onClick={handleClose}>
		<AnimatePresence>
            <motion.div onClick={handleClose}
                className="margin-auto rounded-lg flex flex-col space-y-2 items-center w-3/4  h-screen lg:h-5/6 bg-blue-700 text-slate-200 px-8 py-2" 
                initial={{
                    opacity: 0,
                    scale: 0.75,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                        ease: "easeOut",
                        duration: 0.15,
                    },
                }}
                exit={{
                    opacity: 0,
                    scale: 0.75,
                    transition: {
                        ease: "easeIn",
                        duration: 0.15,
                    },
                }}
                
            >
                
                <div className="text-base lg:text-2xl flex space-x-3 items-center font-bold text-lime-400">
                    <div>Welcome to Spoti-Tweet!!!  </div>
                    <img src={icon.src} alt=""  className="w-10 h-10"/>
                    </div>

                <div className="">
                    <div className="text-sm lg:text-base font-bold">What is this?</div>
                    <div className="text-xs lg:text-sm">Spoti-tweet is a web app that allows combines Spotify and Twitter to create a social media platform for sharing everything music.</div>
                    
                </div>

                <div className="">
                    <div className="text-sm lg:text-base font-bold">How do I use the Spotify part?</div>
                    <div className="text-xs lg:text-sm">First, you need to connect your Spotify account by pressing signIn. You will be able to look at your playlists and songs just like the Spotify app. You can even search up different songs, artist, and albums. There is also a player component that lets you play these songs. Howver, you need to have to have an external Spotify Web Player playing for it to work. To do this, go to Spotify with your account, and press play/pause once or twice. The volume functionality does not work on mobile versions. Additionally, when you play a song from an album or playlist, the rest of the playlist isn&quot;t added onto the queue as it hasn&quot;t been implimented yet.</div>
                </div>

                <div className="">
                    <div className="text-sm lg:text-base font-bold">How do I use the Twitter part?</div>
                    <div className="text-xs lg:text-sm">Just like every other social media platform, you can post, like, and comment on posts. You can change your name, username, and bio in the profile section. You can follow other users to see their specific posts as well. What makes this app special is that you have to attach a song to each post.</div>
                </div>

                <div className="text-sm lg:text-base font-bold">Good luck and have fun !!! <br /> FYI:  Spotify features will only work with Spotify Prenium</div>

                <div className="font-bold uppercase text-green-500">Spoti-Tweet is currently not out for public. Either request access by emailing haramkim082@gmail.com or use this sample account. <br />
                <span className="text-yellow-500">
                Email: haramalt60@gmail.com
                Password: haramalt60</span></div>

                <p className="text-slate-400 hover:underline cursor-pointer">Click anywhere to close</p>
        
        </motion.div>

</AnimatePresence>
</Backdrop>
	)
}
