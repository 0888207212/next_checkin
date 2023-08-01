import "./globals.css";
import type { Metadata } from "next";

import { ReduxProvider } from "@/redux/provider";
import { AuthLayout } from "@/components/layout/Auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "CheckinGPS",
  description: "Application CheckinGPS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthLayout>
            {children}
            <ToastContainer />
          </AuthLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
