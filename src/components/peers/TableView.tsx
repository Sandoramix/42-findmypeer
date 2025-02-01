import { FC } from "react";
import { usePeersStore } from "~/utils/stores/peersStore";

export const PeerTableView: FC = () => {
	const { peers } = usePeersStore();

	const getIntraProfileLink = (username: string) => `https://profile.intra.42.fr/users/${username}`;

	return (<table id="table" className="w-full max-w-6xl mx-auto overflow-y-auto border border-t-0 border-collapse border-white/20 grow h-full">
		<thead>
			<tr className="sticky top-0 left-0 border-t-0 bg-zinc-900">
				<th className="px-3 py-1 border border-t-0 border-white/10">Username</th>
				<th className="px-3 py-1 border border-t-0 border-white/10">Position</th>
				<th className="hidden px-3 py-1 border border-t-0 sm:table-cell border-white/10">Cluster</th>
				<th className="hidden px-3 py-1 text-xs border border-t-0 xs:table-cell border-white/10 xs:text-sm sm:text-base">Row</th>
				<th className="hidden px-3 py-1 border border-t-0 xs:table-cell border-white/10">Pc</th>
			</tr>
		</thead>
		<tbody>
			{peers?.map((peer, i) => (
				<tr id={`user-${peer.username}`} key={i} className="border border-white/10">
					<td className="border border-white/10 h-10">
						<a className="flex justify-center items-center" href={getIntraProfileLink(peer.username)} target="_blank" referrerPolicy="no-referrer">{peer.username}</a>
					</td>
					<td className="border border-white/10 h-10">
						<div className="flex justify-center items-center">{peer.position.raw}</div>
					</td>
					<td className="hidden sm:table-cell border border-white/10 h-10">
						<div className="flex justify-center items-center">{peer.clusterName}</div>
					</td>
					<td className="hidden xs:table-cell border border-white/10 h-10">
						<div className="flex justify-center items-center">{peer.position.row}</div>
					</td>
					<td className="hidden xs:table-cell border border-white/10 h-10">
						<div className="flex justify-center items-center">{peer.position.pc}</div>
					</td>
				</tr>
			))}
		</tbody>
	</table>);
};