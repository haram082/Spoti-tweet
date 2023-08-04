import React from 'react'
import {MdArrowBackIosNew} from 'react-icons/md';
import { useRouter } from 'next/router';

const BackArrow = () => {
    const router = useRouter()
  return (
    <span onClick={() => router.back()}><MdArrowBackIosNew className='inline-block text-3xl text-slate-200 hover:text-slate-400 cursor-pointer'/></span>
  )
}

export default BackArrow
