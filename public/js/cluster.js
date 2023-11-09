const CLUSTER_TABLES = document.querySelectorAll(`#tab-clusters table`);


function updateCluster(){
	CLUSTER_TABLES.forEach((cluster, clusterIdx)=>{
		const rows = cluster.querySelectorAll(`tbody tr`);
		rows.forEach((cRow, cRowIdx)=>{
			const pcs = cRow.querySelectorAll(`.pc`);
			pcs.forEach((crPc, crPcIdx)=>{
				const user = findUserByPosition(clusterIdx + 1, rows.length - cRowIdx, crPcIdx + 1);
				const text = crPc.querySelector(`p`);
				text.innerHTML = user ? user.username : `n/a`;
				if (!user)
					return;
				if (isSearchIncluded(user.username) || isSearchIncluded(user.position.raw)){
					text.classList.toggle(`!text-amber-400`, true);
					text.classList.toggle(`!font-medium`, true);
				}else{
					text.classList.toggle(`!text-amber-400`, false);
					text.classList.toggle(`!font-medium`, false);
				}
			})
		})
	})
}
