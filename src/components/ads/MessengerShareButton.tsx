'use client'

import { useState } from 'react'

export default function MessengerShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)

    if (isMobile) {
      // Deep-links straight into the Messenger app's share sheet so the
      // user can pick a specific contact. Falls back to messenger.com
      // if the app isn't installed (the deep link simply fails silently).
      window.location.href = `fb-messenger://share/?link=${encodeURIComponent(url)}`
      setTimeout(() => {
        window.open('https://www.messenger.com', '_blank')
      }, 800)
    } else {
      // Messenger's contact-picker dialog requires a registered Facebook
      // App ID on desktop, so copy the link and let the user paste it in.
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.open('https://www.messenger.com', '_blank')
      setTimeout(() => setCopied(false), 3000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
      style={{ background: 'linear-gradient(135deg, #00B2FF 0%, #006AFF 50%, #B900FF 100%)' }}
      title="Messenger-ээр илгээх"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.615 4.469 8.652V24l4.088-2.242c1.09.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
      </svg>
      {copied ? 'Холбоос хууллаа!' : 'Messenger'}
    </button>
  )
}
