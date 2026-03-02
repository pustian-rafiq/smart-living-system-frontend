export type Language = 'bn' | 'en'

export const translations = {
  bn: {
    login: {
      title: 'লগইন করুন',
      subtitle: 'আপনার ফোন নম্বর দিয়ে লগইন করুন',
      phoneLabel: 'ফোন নম্বর',
      phonePlaceholder: '০১৭১২৩৪৫৬৭৮',
      sendOtp: 'OTP পাঠান',
      terms: 'লগইন করে আপনি আমাদের শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত হচ্ছেন',
      termsLink: 'শর্তাবলী',
      privacyLink: 'গোপনীয়তা নীতি',
      and: 'এবং',
    },
    otp: {
      title: 'OTP যাচাইকরণ',
      subtitle: 'আপনার ফোনে পাঠানো ৬ সংখ্যার OTP কোডটি লিখুন',
      verify: 'যাচাই করুন',
      resend: 'OTP পুনরায় পাঠান',
      resendIn: 'পুনরায় পাঠান',
      seconds: 'সেকেন্ড',
      didntReceive: 'OTP পাননি?',
      changeNumber: 'নম্বর পরিবর্তন করুন',
    },
    role: {
      title: 'আপনার ভূমিকা নির্বাচন করুন',
      subtitle: 'আপনি কীভাবে প্ল্যাটফর্ম ব্যবহার করতে চান?',
      student: 'ছাত্র/ভাড়াটে',
      studentDesc: 'আবাসন খুঁজছেন',
      owner: 'মালিক/ম্যানেজার',
      ownerDesc: 'আবাসন প্রদান করছেন',
      continue: 'চালিয়ে যান',
    },
    common: {
      loading: 'লোড হচ্ছে...',
      error: 'একটি ত্রুটি ঘটেছে',
      back: 'পিছনে',
    },
  },
  en: {
    login: {
      title: 'Login',
      subtitle: 'Login with your phone number',
      phoneLabel: 'Phone Number',
      phonePlaceholder: '01712345678',
      sendOtp: 'Send OTP',
      terms: 'By logging in, you agree to our',
      termsLink: 'Terms & Conditions',
      privacyLink: 'Privacy Policy',
      and: 'and',
    },
    otp: {
      title: 'OTP Verification',
      subtitle: 'Enter the 6-digit OTP code sent to your phone',
      verify: 'Verify',
      resend: 'Resend OTP',
      resendIn: 'Resend in',
      seconds: 'seconds',
      didntReceive: "Didn't receive OTP?",
      changeNumber: 'Change Number',
    },
    role: {
      title: 'Select Your Role',
      subtitle: 'How would you like to use the platform?',
      student: 'Student / Renter',
      studentDesc: 'Looking for accommodation',
      owner: 'Owner / Manager',
      ownerDesc: 'Providing accommodation',
      continue: 'Continue',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      back: 'Back',
    },
  },
}

export const getLanguage = (): Language => {
  if (typeof window === 'undefined') return 'bn'
  const stored = localStorage.getItem('language') as Language | null
  return stored || 'bn'
}

export const setLanguage = (lang: Language): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('language', lang)
}

export const toggleLanguage = (): Language => {
  const currentLang = getLanguage()
  const newLang = currentLang === 'bn' ? 'en' : 'bn'
  setLanguage(newLang)
  return newLang
}
