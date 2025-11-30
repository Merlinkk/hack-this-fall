'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStorageItem, STORAGE_KEYS } from '@/lib/storage';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Get saved language preference or default to 'en'
    const savedLang = getStorageItem<string>('nirogya_language') || 'en';
    
    // Check if user has completed onboarding
    const userInfo = getStorageItem(STORAGE_KEYS.USER_INFO);
    const onboardingComplete = getStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    
    if (userInfo && onboardingComplete) {
      // User is logged in, redirect to home
      router.replace(`/${savedLang}/home`);
    } else {
      // User needs to onboard, redirect to onboarding
      router.replace(`/${savedLang}/onboarding`);
    }
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#83C818] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Nirogya AI...</p>
      </div>
    </div>
  );
}

