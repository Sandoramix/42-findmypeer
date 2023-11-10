const CLUSTERS_SECTION = document.querySelector(`#tab-clusters`);
var CLUSTER_TABLES;


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
	Object.values(CLUSTERS).forEach(c=>{
		const fieldset = document.createElement(`fieldset`)
		fieldset.setAttribute(`data-cluster`, c.id);
		fieldset.className = "w-full max-w-6xl p-1 border-t border-b xl:border xl:rounded shrink-0 border-white/10 xl:p-4"

		const legend = document.createElement(`legend`);
		legend.className = `font-bold`;
		legend.textContent = `Cluster ${c.id} | ${c.name}`;

		const table = document.createElement(`table`);
		table.className = `w-full grow text-xxxs xs-sm:text-xxxm md:text-xs xl:text-sm 2xl:text-base`;

		const thead = document.createElement(`thead`)
		const theadTr = document.createElement(`tr`)
		theadTr.className = `text-xs text-center xs:text-sm sm:text-base`;
		let p = 1;
		for (let i = 0; i < c.columns + 1;i++){
			const th = document.createElement(`th`);
			if (i === 0)
			{
				th.className = `w-3 aspect-square sm:w-8`
			} else {
				const div = document.createElement(`div`);
				div.className = `w-full font-extrabold`
				div.textContent = !c.spacerColumns.includes(i - 1) ? `P${p++}` : ``;
				th.append(div);
			}
			theadTr.append(th);
		}
		thead.append(theadTr);
		table.append(thead);

		const tbody = document.createElement(`tbody`);
		tbody.className = `font-light`

		for(let row = 1; row <= c.rows; row++){
			const tr = document.createElement(`tr`);
			let pc = 1;
			for(let i = 0; i < c.columns + 1; i ++){
				const td = document.createElement(`td`);

				if (i === 0 || c.spacerColumns.includes(i - 1)){
					const div = document.createElement(`div`);
					if (i === 0)
					{
						div.className = `w-5 h-5 text-xs font-extrabold text-center xs:text-sm sm:text-base`;
						div.textContent = `R${c.rows - row + 1}`
					}
					else {
						div.className = `w-5 sm:w-10`
					}
					td.append(div);
					tr.append(td);
					continue;
				}
				td.className = `pc relative border-b border-white/10`
				const a = document.createElement(`a`)
				a.className = `flex flex-col items-center justify-center w-full`
				// TODO CHANGE IMG TO SVG
				const img = document.createElement(`img`)
				img.className = `object-scale-down w-4 xs:w-7 sm:w-10`
				img.src = `images/monitor.png`

				const p = document.createElement(`p`)
				p.setAttribute(`data-username`, '')
				p.className = `w-[8ch] text-ellipsis overflow-hidden`
				p.textContent = `pasquale`;

				if (pc++ % 2 != 0)
				{
					a.append(p);
					a.append(img);
				}else{
					a.append(img);
					a.append(p);
				}
				td.append(a);
				tr.append(td);
			}
			tbody.append(tr);
		}
		table.append(tbody);
		fieldset.append(legend);
		fieldset.append(table);
		CLUSTERS_SECTION.append(fieldset);
	})
	_updateClusterRef();
}

function _updateClusterRef(){
	CLUSTER_TABLES = CLUSTERS_SECTION.querySelectorAll(`#tab-clusters table`)
}

generateCluster();
_updateClusterRef();