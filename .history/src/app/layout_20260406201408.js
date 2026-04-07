import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Luxe Dining",
  description: "A Culinary Journey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#050505] text-white antialiased`}>
        
        {/* THE FLOATING GLASS NAVBAR */}
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="flex items-center gap-8 px-8 py-4 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-2xl pointer-events-auto">
            <Link href="/" className="text-sm font-medium text-white/70 hover:text-amber-500 transition-colors tracking-widest uppercase">Our Story</Link>
            <Link href="/chefs" className="text-sm font-medium text-white/70 hover:text-amber-500 transition-colors tracking-widest uppercase">The Chefs</Link>
            <div className="w-px h-4 bg-white/20"></div>
            <Link href="/menu" className="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors tracking-widest uppercase flex items-center gap-2">
              Order Now <span className="text-lg leading-none">→</span>
            </Link>
          </div>
        </nav>

        {children}
        
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