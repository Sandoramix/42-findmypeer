import { create } from "zustand"
import { env } from "~/env";
import { api, RouterOutputs } from "~/utils/api"

export type PeerStore = {
	peers: RouterOutputs['peers']['fetchedPeers']['peers'] | null,

	errored?: boolean,

	refresh: (res: RouterOutputs['peers']['fetchedPeers'], errored?: boolean) => void,
	error: () => void,
}

export const usePeersStore = create<PeerStore>((set) => ({
	peers: null,

	refresh: (res: RouterOutputs['peers']['fetchedPeers'], errored = false) => {
		set({ peers: res.peers, errored })
	},
	error: () => {
		set({ errored: true, })
	}
}))
