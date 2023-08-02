import React from 'react'
import { useSession } from 'next-auth/react';
import { PageLayout } from '~/components/layout';
import Image from 'next/image';

const library = () => {
    const { data: session } = useSession();
    console.log(session)
    if (!session || !session.user) return <div className='flex justify-center items-center text-3xl'>LogIn to see Data</div>;
  return (
    <PageLayout>
    <div className='flex'>
        <h1>{session.user.name}'s Library</h1> 
        
      
    </div>
    </PageLayout>
  )
}

export default library
