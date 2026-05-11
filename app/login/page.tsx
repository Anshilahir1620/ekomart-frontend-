'use client'

import { Suspense } from 'react'
import LoginPage from './LoginPage'; 
export default function Loginpage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  )
}