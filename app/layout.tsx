import "./globals.css";
import type { Metadata } from "next";

import { ReduxProvider } from "@/redux/provider";
import { AuthLayout } from "@/components/layout/Auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";

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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
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
