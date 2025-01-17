"use client"
import React from 'react'
import { RotatingLines } from 'react-loader-spinner'
export const runtime = 'edge';

const Loading = () => {
  return (
    <>
    <br /><br /><br />
    <div className='flex justify-center items-center'>
    <RotatingLines width='300' />
    </div>
    <p className='text-center text-3xl'>処理中です しばらくお待ち下さい</p>
    </>
  )
}

export default Loading