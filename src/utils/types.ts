
/**
 * Cluster configuration.
 * @param id - The cluster's id.
 * @param name - The cluster's name.
 * @param rows - The number of rows in the cluster.
 * @param columns - The number of columns in the cluster (including spacer columns).
 * @param spacerColumns - The indices of the columns that are spacer columns.
 * @param pcColors - The colors of the PCs in the cluster.
 * @param isWeird - Whether the cluster is weird (the rotations are not following an exact pattern).
 * @param rotations - The rotations of the PCs in the cluster, will be used only if `isWeird` is `true`.
 */
export type ClusterConfig = {
	id: number;
	name: string;
	rows: number;
	columns: number;
	spacerColumns: number[];
	pcColors: {
		active: PcColor;
		inactive: PcColor;
		empty: PcColor;
	};
	isWeird: boolean;
	rotations: PcRotation | null;
}

/**
 * Usually used when `isWeird` is `true` in {@link ClusterConfig}.
 * It is a dictionary of rotations (in degrees) for each row.
 * The key is the row number, and the value is an array of rotations, where each element is the rotation of a single PC.
 */
export type PcRotation = Record<string, number[]>

/**
 * Dictionary of colors for each PC.
 * The key is the state of the PC (active, inactive, empty), and the value is the color of the PC.
 * The default color is used when the state is not specified.
 * The matched color is used when the search query matches the cluster/user/row/pc.
 */
export type PcColor = {
	default?: string;
	matched?: string;
}

export type PeerDTO = {
	username: string;
	position: PositionDTO;
}

export type PositionDTO = {
	cluster: number;
	row: number;
	pc: number;

	raw: string;
}