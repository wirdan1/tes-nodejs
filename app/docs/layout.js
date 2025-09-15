// app/docs/layout.js
// custom

export const metadata = {
  title: "Docs!!",
  description: "Api!",
  keywords: "Hello Word",
  openGraph: {
    title: "Hookrest - REST API Documentation",
    description:
      "Hookrest is a free, simple REST API created by danz for the common good. Feel free to use it, but please avoid DDoS attacks.",
    url: "https://hookrest.my.id",
    type: "website",
    images: [
      {
        url: "https://qu.ax/WAkgH.jpg",
        width: 800,
        height: 600,
        alt: "Danz Logo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}