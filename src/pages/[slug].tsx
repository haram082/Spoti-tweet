import React from 'react'
import { PageLayout } from '~/components/layout/layout'
import type {NextPage} from 'next'
import Head from 'next/head'
import TopRightIcon from '~/components/layout/TopRightIcon'
import BackArrow from '~/components/layout/BackArrow'
import { useRouter } from 'next/router'

const Profile: NextPage = () => {
  const router = useRouter()
  const {slug} = router.query
  if (typeof slug !== 'string') return null
  const username = slug.replace('@', '')
  return (
    <PageLayout>
       <Head>
        <title>Profile</title>
        </Head>
        <TopRightIcon />
        <BackArrow/>
        <div className='text-center text-3xl'>profile for {username}</div>
    </PageLayout>
  )
}

export default Profile