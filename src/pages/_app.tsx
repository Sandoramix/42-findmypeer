import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { PeerDataProvider } from "~/providers/PeerDataProvider";
import { Layout } from "~/components/layout/layout";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<Layout>
			<PeerDataProvider />
			<Component {...pageProps} />
		</Layout>
	);
};

export default api.withTRPC(MyApp);
