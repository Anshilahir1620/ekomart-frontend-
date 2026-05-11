import React, { Suspense } from 'react';
import Shope from './Shope';

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading shop...</div>}>
      <Shope />
    </Suspense>
  );
}
