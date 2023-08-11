import { motion, AnimatePresence } from "framer-motion"
import React, { useState } from "react"
import { api } from "~/utils/api"
import { useRouter } from "next/router"

type ModalProps = {
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    currentName: string,
    currentUsername: string,
    currentBio: string | null,
}
const Backdrop = ({children}) => {
    return (
      <motion.div
      className='absolute top-0 left-0 w-full h-full bg-blue-300 bg-opacity-50 z-50 flex justify-center items-center' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
           {children}
      </motion.div>
    )
}

export const ProfileModal = ({ setIsOpen,currentBio, currentName, currentUsername }: ModalProps) => {
    const [name, setName] = useState(currentName)
    const [username, setUsername] = useState(currentUsername)
    const [bio, setBio] = useState(currentBio)
    const { push } = useRouter()
    const trpcUtils = api.useContext()
    const {mutate} = api.profile.updateProfile.useMutation({
        onSuccess: () => {
            console.log("success")
            setIsOpen(false)
            void trpcUtils.profile.getUserbyUsername.invalidate()
            
        },
        onError: (err) => {
            console.log(err)
        },
    }
    )

	return (
        <Backdrop>
		<AnimatePresence>
            <motion.form
                className="margin-auto py-8 rounded-md flex flex-col space-y-2 items-center w-[500px]  h-[450px] bg-slate-900 text-slate-700"
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
                onClick={(e)=> e.stopPropagation()}
            >
                
                <div className="text-xl font-bold text-slate-200">Edit Your Profile</div>

                <div className="input-container ic1">
                    <input placeholder="Name" type="text" className="w-60 lg:w-80 rounded-sm p-2"
                    value={name} onChange={(e)=> setName(e.target.value)} required/>
                </div>

                <div className="input-container ic2">
                    <input placeholder="Username" type="text" className="w-60 lg:w-80 rounded-sm p-2" value={username} onChange={(e)=> setUsername(e.target.value)} required/>   
                </div>
                <div>
                    <textarea placeholder="Add a bio.." className="w-60 lg:w-80 rounded-sm p-2"  rows={6}
                    value={bio ? bio: ""} onChange={(e)=> setBio(e.target.value)}/>
                </div>
                
        <div className="flex">
        <button
            type="button"
            tabIndex={0}
            className="mt-3 w-24 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:scale-95 ml-3"
            onClick={() => setIsOpen(false)}
        >
            Cancel
        </button>
        <button
            type="submit"
            tabIndex={0}
            className="mt-3 w-24 rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 hover:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-3 "
            onClick={() => {mutate({name: name, username: username, bio: bio ? bio: ""}); push(`@${username}`)}}
        >
         Confirm
        </button>
        </div>
        </motion.form>

</AnimatePresence>
</Backdrop>
	)
}
