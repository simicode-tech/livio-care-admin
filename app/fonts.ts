import localFont from 'next/font/local'

export const sfPro = localFont({
  src: [
    {
      path: './fonts/SFProDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/SFProDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/SFProDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/SFProDisplay-ThinItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/SFProDisplay-SemiboldItalic.woff2',
      weight: '600',
      style: 'italic',
    }
  ],
  variable: '--font-sf-pro',
  display: 'swap',
})