/* Small inline-SVG icon set drawn in the SF Symbols visual language (thin/
   regular line weight, rounded joins, monochrome via currentColor) — used
   in place of emoji throughout the app so icons render consistently across
   platforms/fonts instead of depending on the OS's emoji set. Load this
   script before any script that calls Icons.*. */

const Icons = {
  moon(size = 18) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>
    </svg>`;
  },

  sun(size = 18) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2"/>
      <path d="M12 2.5v2.4M12 19.1v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7"/>
    </svg>`;
  },

  bell(size = 18) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5c-.7 0-1.25.56-1.25 1.25v.62C7.98 5.06 6 7.53 6 10.5v4.1l-1.6 2.13c-.5.66-.02 1.6.8 1.6h13.6c.82 0 1.3-.94.8-1.6L18 14.6v-4.1c0-2.97-1.98-5.44-4.75-6.13v-.62c0-.69-.56-1.25-1.25-1.25z"/>
      <path d="M9.7 19.5a2.3 2.3 0 0 0 4.6 0z"/>
    </svg>`;
  },

  checkmarkCircle(size = 16) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2"/>
      <path d="M7.8 12.3l2.7 2.7 5.7-6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  },

  xmarkCircle(size = 16) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2"/>
      <path d="M9 9l6 6M15 9l-6 6" stroke-linecap="round"/>
    </svg>`;
  },

  exclamationTriangle(size = 16) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
      <path d="M12 4.2L21.3 20H2.7z" stroke-linejoin="round"/>
      <path d="M12 10v4" stroke-linecap="round"/>
      <circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none"/>
    </svg>`;
  },

  clock(size = 16) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2"/>
      <path d="M12 7v5.3l3.4 2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  },

  flag(size = 14) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
      <path d="M6 21V4" stroke-linecap="round"/>
      <path d="M6 4.5h11.5l-3 4 3 4H6" stroke-linejoin="round"/>
    </svg>`;
  },

  chevronLeft(size = 14) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14.5 4.5L7 12l7.5 7.5"/>
    </svg>`;
  },

  arrowClockwise(size = 18) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4.6 12a7.4 7.4 0 1 1 2.2 5.27"/>
      <path d="M4.4 16.3v-4h4"/>
    </svg>`;
  },

  mic(size = 18) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
      <rect x="9" y="2.8" width="6" height="11" rx="3" fill="currentColor" stroke="none"/>
      <path d="M6 11a6 6 0 0 0 12 0" stroke-linecap="round"/>
      <path d="M12 19v2.6M8.3 21.6h7.4" stroke-linecap="round"/>
    </svg>`;
  },

  wrench(size = 18) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L4 17l3 3 5.5-5.5a4 4 0 0 0 5.2-5.2l-2.5 2.5-2-2z"/>
    </svg>`;
  },
};
