'use client'

export default function ShareButton() {
  const handleShare = () => {
    const url = encodeURIComponent(window.location.href)
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    // Mobile: navigate directly so the Facebook app intercepts the link.
    // Desktop: open the share dialog in a centered popup.
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.open(shareUrl, '_blank')
    } else {
      const w = 600, h = 550
      const left = (window.screen.width - w) / 2
      const top = (window.screen.height - h) / 2
      window.open(shareUrl, 'fb-share', `width=${w},height=${h},left=${left},top=${top},popup=yes`)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
      style={{ background: '#1877F2' }}
      title="Facebook-т хуваалцах"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      Хуваалцах
    </button>
  )
}
