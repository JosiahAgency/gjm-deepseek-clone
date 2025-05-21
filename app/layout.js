import "./globals.css";
import {Inter} from "next/font/google"
import {ClerkProvider} from "@clerk/nextjs";
import {AppContextProvider} from "@/context/AppContext";

const inter = Inter({
    variable: "--font-inter",
    subsets: ['latin']
})

export const metadata = {
    title: "GJM - DeepSeek",
    description: "This is GJM's DeepSeek Clone",
};

export default function RootLayout({children}) {
    return (
        <ClerkProvider>
            <AppContextProvider>
                <html lang="en">
                <body
                    className={`${inter.className} antialiased`}
                >
                {children}
                </body>
                </html>
            </AppContextProvider>
        </ClerkProvider>

    );
}
