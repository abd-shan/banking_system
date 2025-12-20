import { AuthProvider } from '@/context/AuthContext';
import { AccountProvider } from '@/context/AccountContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { Layout } from '@/components/Layout';
import type {Metadata} from "next";
import './globals.css'

export const metadata: Metadata = {
  title: "Bank Management System",
  description: "Next.js Frontend with Facade Pattern for NestJS Backend",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body>
      <AuthProvider>
          <AccountProvider>

              <NotificationProvider>
                  <Layout>{children}</Layout>
              </NotificationProvider>
          </AccountProvider>
      </AuthProvider>
      </body>
      </html>
  );
}
