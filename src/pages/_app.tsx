import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Geist } from "next/font/google";
import Head from "next/head";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { BaseLayout } from "~/components/BaseLayout";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Find my peer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="42 Florence cluster viewing tool" />
      </Head>
      <SessionProvider session={session}>
        <BaseLayout>
          <Component {...pageProps} />
        </BaseLayout>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
