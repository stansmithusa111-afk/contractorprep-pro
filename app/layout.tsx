import type { Metadata } from 'next';
import './globals.css';
import NavHeader from './components/NavHeader';

export const metadata: Metadata = {
  title: 'ContractorPrep Pro — Florida B&F Exam Prep',
  description: 'Blueprint-weighted practice exams for Florida CGC, CBC, and CRC candidates.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavHeader />
        {children}
      </body>
    </html>
  );
}
