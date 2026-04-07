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
      <body className={`${inter.className} bg-[#050505] text-zinc-200 antialiased flex flex-col min-h-screen`}>
        
        {/* THE FLOATING GLASS NAVBAR */}
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="flex items-center gap-8 px-8 py-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto">
            <Link href="/" className="text-sm font-medium text-white/70 hover:text-amber-500 transition-colors tracking-widest uppercase">Our Story</Link>
            <Link href="/chefs" className="text-sm font-medium text-white/70 hover:text-amber-500 transition-colors tracking-widest uppercase">The Chefs</Link>
            <div className="w-px h-4 bg-white/20"></div>
            <Link href="/menu" className="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors tracking-widest uppercase flex items-center gap-2">
              Order Now <span className="text-lg leading-none">→</span>
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div className="flex-grow">
          {children}
        </div>

        {/* GLOBAL FOOTER */}
        <footer className="bg-[#0a0a0a] border-t border-white/5 pt-16 pb-8 px-6 mt-20 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-serif text-amber-500 mb-4">Luxe Dining</h3>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                An immersive culinary experience blending classic techniques with modern artistry. 
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium tracking-widest uppercase text-sm mb-4">Explore</h4>
              <ul className="space-y-2 text-zinc-500 text-sm">
                <li><Link href="/" className="hover:text-amber-500 transition-colors">Our Story</Link></li>
                <li><Link href="/chefs" className="hover:text-amber-500 transition-colors">The Masters</Link></li>
                <li><Link href="/menu" className="hover:text-amber-500 transition-colors">Digital Menu</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium tracking-widest uppercase text-sm mb-4">Visit Us</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                123 Culinary Lane<br />
                Metropolis, NY 10001<br />
                reservations@luxedining.com
              </p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600">
            <p>© {new Date().getFullYear()} Luxe Dining. All Rights Reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
              <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
            </div>
          </div>
        </footer>
        
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