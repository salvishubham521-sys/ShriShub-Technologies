import "./globals.css";
import Link from "next/link";
import { brand } from "@/lib/config";
import Chatbot from "@/components/Chatbot";

export const metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en">
    <body>
      <header className="nav">
        <div className="container nav-inner">
          <Link className="brand" href="/"><span>✦</span> {brand.name}</Link>
          <nav className="nav-links">
            <Link href="/services">Services</Link>
            <Link href="/#how">How it works</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/admin">Admin</Link>
          </nav>
          <Link className="btn" href="/order">Get a quote</Link>
        </div>
      </header>
      {children}
      <Chatbot />
      <footer className="footer"><div className="container" style={{display:"flex",justifyContent:"space-between",gap:20,flexWrap:"wrap"}}>
        <div><strong>{brand.name}</strong><div style={{marginTop:8}}>Professional websites and web applications.</div></div>
        <div style={{display:"flex",gap:16}}><Link href="/services">Services</Link><Link href="/dashboard">Customer portal</Link><Link href="/admin">Admin</Link></div>
      </div></footer>
    </body>
  </html>;
}
