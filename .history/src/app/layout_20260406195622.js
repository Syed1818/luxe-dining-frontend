import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // 1. Import this

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Luxe Dining",
  description: "Premium QR Menu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        
        {/* 2. Add the global Toaster with custom styling! */}
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#27272a', // Zinc 800
              color: '#fff',
              border: '1px solid #d4af37', // Gold border
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            },
            success: { iconTheme: { primary: '#d4af37', secondary: '#000' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
          }} 
        />
      </body>
    </html>
  );
}