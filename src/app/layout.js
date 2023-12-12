import { Inter } from 'next/font/google';
import RootLayout from './RootLayout';
import AuthProvider from './AuthProvider';

const inter = Inter({ subsets: ['latin'] })
const COMPANY_NAME = "StrongerTogether";

export const metadata = {
  title: COMPANY_NAME
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <RootLayout title={COMPANY_NAME}>
            {children}
          </RootLayout>  

        </AuthProvider>
      </body>
    </html>
  );
}
