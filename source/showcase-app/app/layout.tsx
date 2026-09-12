import type {Metadata} from 'next';
import './globals.css';
import './ux.css';
import './use-cases.css';
export const metadata:Metadata={title:'DeepGrid Semi — One Silicon. Infinite Possibilities.',description:'Explore DeepGrid’s 28nm monolithic silicon platform, fifteen products, sensor-fusion architecture and investor materials.',icons:{icon:'./favicon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en" className="dark"><body>{children}</body></html>;}
