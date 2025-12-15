import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {TRPCReactProvider} from "@/trpc/client";
import {Toaster} from "sonner";
import {NuqsAdapter} from "nuqs/adapters/next";
import {Provider} from "jotai"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nodebase",
<<<<<<< HEAD
  description: "*A production-ready, full-stack workflow automation platform with AI integration and real-time execution monitoring",
=======
  description: "A production-ready, full-stack workflow automation platform with AI integration and real-time execution monitoring",
>>>>>>> 7b90b49df99c0bbc4d2466b1ebf85655bdda49cc
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <html lang="en">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased max-h-screen`}
      >
      <TRPCReactProvider>
        <NuqsAdapter>
          <Provider>
            {children}
          </Provider>
          <Toaster theme={"dark"}/>
        </NuqsAdapter>
      </TRPCReactProvider>
      </body>
      </html>
  )
}
