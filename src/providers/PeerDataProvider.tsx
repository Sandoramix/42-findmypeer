import { FC, useEffect, useRef } from "react";
import { env } from "~/env";
import { usePeersStore } from "~/utils/stores/peersStore";
import { api } from "~/utils/api";

export const PeerDataProvider: FC = ({ }) => {
	const { data, error: apiError } = api.peers.fetchedPeers.useQuery();
	const { refresh: storeRefresh, error: storeError } = usePeersStore((state) => state);
	const utils = api.useUtils();

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);  // For storing the timeout ID

	useEffect(() => {
		if (data) {
			storeRefresh(data);

			const now = Date.now();
			const nowD = new Date();
			const refreshIn = data.refreshAt - now >= 0
				? data.refreshAt - now
				: (1000 * env.NEXT_PUBLIC_API_REFRESH_SECONDS) - (nowD.getSeconds() * 1000);;

			console.log("Refresh AT: ", data.refreshAt, env.NEXT_PUBLIC_API_REFRESH_SECONDS);
			console.log("Now: ", now);
			console.log("Refresh IN: ", refreshIn);
			const delay = Math.max(refreshIn, 1000);

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				utils.peers.fetchedPeers.refetch();
			}, delay);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [data, storeRefresh]);

	useEffect(() => {
		if (apiError) {
			storeError();
		}
	}, [apiError, storeError]);

	return (null);
};
