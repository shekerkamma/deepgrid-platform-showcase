import type { Metadata } from 'next';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';
import './ux.css';
import './use-cases.css';
import './ask.css';
import './site.css';
import './showcase-refinement.css';

const site = 'https://shekerkamma.github.io/deepgrid-platform-showcase/';
export const metadata: Metadata = {
  title: 'DeepGrid Semi: one silicon, fifteen products',
  description:
    'DeepGrid designs a 28 nm automotive SoC and fifteen products on it, for an Indian market where driver assistance on trucks and buses is now law. Products, technology, films and the pre-Series A investment case.',
  icons: { icon: './favicon.svg' },
  metadataBase: new URL(site),
  openGraph: {
    type: 'website',
    url: site,
    siteName: 'DeepGrid Semi',
    title: 'DeepGrid Semi: one silicon, fifteen products',
    description:
      'A 28 nm automotive SoC under fifteen products, and the pre-Series A case to take it from FPGA to qualified silicon.',
    images: [
      {
        url: site + 'images/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Rendering of the DeepGrid SoC2 package',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
