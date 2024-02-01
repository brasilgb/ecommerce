'use client';
import { Roboto } from 'next/font/google';
import '@/styles/globals.css';
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { checkIsPublicRoute } from "@/functions/check-is-public-route";
import PrivateRoute from "@/components/privateroute";

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700', '900'],
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isPublicPage = checkIsPublicRoute(pathname!);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Envio de Push - Portal Grupo Solar</title>
      </head>
      <body className={`${roboto.variable}`}>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-dark">
          <AuthProvider>
            {/* {isPublicPage && children}
            {!isPublicPage && (
              <PrivateRoute> */}
                <Header />
                <div className="flex-grow pb-4 w-full px-4">
                  {children}
                </div>
                <Footer />
              {/* </PrivateRoute>
            )} */}
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}