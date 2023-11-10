const CLUSTER_TABLES = document.querySelectorAll(`#tab-clusters table`);


function updateCluster(){
	CLUSTER_TABLES.forEach((cluster, clusterIdx)=>{
		const rows = cluster.querySelectorAll(`tbody tr`);
		rows.forEach((cRow, cRowIdx)=>{
			const pcs = cRow.querySelectorAll(`.pc`);
			pcs.forEach((crPc, crPcIdx)=>{
				const [cluster, row, pc] = [clusterIdx + 1, rows.length - cRowIdx, crPcIdx + 1];
				const user = findUserByPosition(cluster, row, pc);
				const userLink = crPc.querySelector(`a`);
				const usernameP = userLink.querySelector(`[data-username]`);

				userLink.href = ``

				userLink.classList.toggle(`text-neutral-600`, false);
				userLink.classList.toggle(`!text-amber-400`, false);
				// userLink.classList.toggle(`!font-medium`, false);
				if (user && isSearchIncluded(user.username) || isSearchIncluded(`c${cluster}r${row}p${pc}`)){
					userLink.classList.toggle(`!text-amber-400`, true);
					// userLink.classList.toggle(`!font-medium`, true);
				}

				if (!user){
					userLink.classList.add('disabled');
					userLink.classList.toggle(`text-neutral-600`, true);

					usernameP.textContent = `n/a`;
					return;
				}
				userLink.classList.remove('disabled');
				userLink.href = `https://profile.intra.42.fr/users/${user.username}`
				userLink.target = '_black';
				userLink.referrerPolicy = 'noreferrer'

				usernameP.textContent = user.username;

			})
		})
	})
}



function generateCluster(){
	CLUSTER_TABLES.forEach((cluster, clusterIdx)=>{
		const rows = cluster.querySelectorAll(`tbody tr`);
		rows.forEach((cRow, cRowIdx)=>{
			const pcs = cRow.querySelectorAll(`.pc`);
			pcs.forEach((crPc, crPcIdx)=>{
				// const [cluster, row, pc] = [clusterIdx + 1, rows.length - cRowIdx, crPcIdx + 1];
				// const user = findUserByPosition(cluster, row, pc);
				// const userLink = document.createElement(`a`);

				// userLink.textContent = `n/a`;
				// userLink.href = ``

				// userLink.classList.toggle(`text-neutral-600`, false);
				// userLink.classList.toggle(`!text-amber-400`, false);
				// // userLink.classList.toggle(`!font-medium`, false);
				// if (user && isSearchIncluded(user.username) || isSearchIncluded(`c${cluster}r${row}p${pc}`)){
				// 	userLink.classList.toggle(`!text-amber-400`, true);
				// 	// userLink.classList.toggle(`!font-medium`, true);
				// }

				// if (!user){
				// 	userLink.classList.add('disabled');
				// 	userLink.classList.toggle(`text-neutral-600`, true);
				// 	return;
				// }
				// userLink.classList.remove('disabled');
				// userLink.textContent = user.username;
				// userLink.href = `https://profile.intra.42.fr/users/${user.username}`
				// userLink.target = '_black';
				// userLink.referrerPolicy = 'noreferrer'

			})
		})
	})
}

generateCluster();