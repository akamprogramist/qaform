import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { CurrentUserProvider } from "@/context/CurrentUserContext";
import Header from "@/components/Header";
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <CurrentUserProvider>
          <Header />
          {children}
          <ToastContainer />
        </CurrentUserProvider>
      </body>
    </html>
  );
}
