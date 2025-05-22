import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import SessionWrapepr from "@/components/session-wrapper";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "An-Nur",
  description:
    "IT Hackathon Project for 1st-SN Bose National Science Festival 2025",
};

export default function RootLayout({ children, session, ...pageProps }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapepr session={session} {...pageProps}>
            <div className="w-full mx-auto justify-center items-center">
              <NavBar />
              <main className="container min-h-screen mx-auto p-6 max-w-screen-xl justify-center items-center">
                {children}
              </main>
              <Footer />
            </div>
          </SessionWrapepr>
        </ThemeProvider>
      </body>
    </html>
  );
}
