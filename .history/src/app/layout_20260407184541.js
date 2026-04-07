import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ConditionalLayout from "./ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

// Server Component Metadata (SEO) remains intact!
export const metadata = {
  title: "Luxe Dining",
  description: "A Culinary Journey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#050505] text-zinc-200 antialiased flex flex-col min-h-screen`}>
        
        {/* Our new wrapper that handles hiding the UI on the Kitchen page */}
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 4000,
            style: { background: '#18181b', color: '#fff', border: '1px solid #d4af37' },
            success: { iconTheme: { primary: '#d4af37', secondary: '#000' } },
          }} 
        />
      </body>
    </html>
  );
}