'use client';
import React from 'react';
import { Suspense } from 'react'

import CheckoutPage from "@/app/Chekout/ChekoutPage"

export default function ShopPage() {
    return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPage />
    </Suspense>
  )


}