const CLUSTERS_SECTION = document.querySelector(`#tab-clusters`);
var CLUSTER_TABLES;

function updateCluster() {
	CLUSTER_TABLES.forEach((cluster, clusterIdx) => {
		const rows = cluster.querySelectorAll(`tbody tr`);
		rows.forEach((cRow, cRowIdx) => {
			const pcs = cRow.querySelectorAll(`.pc`);
			pcs.forEach((crPc, crPcIdx) => {
				const [cluster, row, pc] = [clusterIdx + 1, rows.length - cRowIdx, crPcIdx + 1];
				const colors = CLUSTERS[cluster].pc;

				const pcSvg = crPc.querySelector(`[data-svg="pc"]`);
				const pcSvgFill = crPc.querySelector(`path`);

				const user = findUserByPosition(cluster, row, pc);
				const userLink = crPc.querySelector(`a`);
				const usernameP = userLink.querySelector(`[data-username]`);

				userLink.href = ``;

				if (SEARCH_INPUT.value == '' && user && !isSearchIncluded(user.username) && !isSearchIncluded(`c${cluster}r${row}p${pc}`)) {
					pcSvgFill.style.fill = colors.active;
				} else {
					pcSvgFill.style.fill = colors.idle;
				}

				userLink.classList.toggle(`text-neutral-600`, false);
				userLink.classList.toggle(`!text-amber-400`, false);
				crPc.classList.toggle(`disabled`, false);
				// userLink.classList.toggle(`!font-medium`, false);
				if (user && isSearchIncluded(user.username) || isSearchIncluded(`c${cluster}r${row}p${pc}`)) {
					pcSvgFill.style.fill = colors.found;
					userLink.classList.toggle(`!text-amber-400`, true);
					// userLink.classList.toggle(`!font-medium`, true);
				}


				if (!user) {
					pcSvgFill.style.fill = colors.inactive;
					userLink.classList.add('disabled');
					userLink.classList.toggle(`text-neutral-600`, true);

					usernameP.textContent = `n/a`;
					crPc.classList.toggle(`disabled`, true);
					return;
				}
				userLink.classList.remove('disabled');
				userLink.href = `https://profile.intra.42.fr/users/${user.username}`;
				userLink.target = '_black';
				userLink.referrerPolicy = 'noreferrer';

				usernameP.textContent = user.username;

			});
		});
	});
}



function generateCluster() {
	Object.values(CLUSTERS).forEach(c => {
		const fieldset = document.createElement(`fieldset`);
		fieldset.setAttribute(`data-cluster`, c.id);
		fieldset.className = "flex justify-center w-full p-1 border-t border-b xl: max-w-7xl xl:border xl:rounded-lg shrink-0 border-neutral-950";

		const legend = document.createElement(`legend`);
		legend.className = "w-[20ch]";
		legend.innerHTML = `<div class="font-bold text-sm flex-nowrap whitespace-nowrap flex justify-center items-center gap-2"><h3>Cluster ${c.id}</h3><h3>|</h3><h3>${c.name}</h3></div>`;

		const table = document.createElement(`table`);
		table.className = `w-full grow ${c.columns > 14 ? "text-xxxs sm:text-xxs md:text-xs xl:text-sm 2xl:text-base" : "text-xxxs xs-sm:text-xxxm md:text-xs xl:text-sm 2xl:text-base"}`;

		const thead = document.createElement(`thead`);
		const theadTr = document.createElement(`tr`);
		theadTr.className = `text-xs text-center xs:text-sm sm:text-base`;
		let p = 1;
		for (let i = 0; i < c.columns + 1; i++) {
			const th = document.createElement(`th`);
			if (i === 0) {
				th.className = `w-3 aspect-square sm:w-8 relative`;
			} else {
				const div = document.createElement(`div`);
				div.className = `${c.spacerColumns.includes(i) && c.spacerColumns.length > 1 ? "w-3 sm:w-5" : "w-full"} font-extrabold`;
				div.textContent = !c.spacerColumns.includes(i) ? `P${p++}` : ``;
				th.append(div);
			}
			theadTr.append(th);
		}
		thead.append(theadTr);
		table.append(thead);

		const tbody = document.createElement(`tbody`);
		tbody.className = `font-light`;

		for (let row = 1; row <= c.rows; row++) {
			const tr = document.createElement(`tr`);
			let pc = 1;
			for (let i = 0; i < c.columns + 1; i++) {
				const td = document.createElement(`td`);

				if (i === 0 || c.spacerColumns.includes(i)) {
					const div = document.createElement(`div`);
					if (i === 0) {
						div.className = `w-5 h-5 text-xs font-extrabold text-center xs:text-sm sm:text-base`;
						div.textContent = `R${c.rows - row + 1}`;
					}
					else {
						div.className = c.spacerColumns.length > 1 ? `w-3 sm:w-5` : `w-5 sm:w-10`;
					}
					td.append(div);
					tr.append(td);
					continue;
				}
				td.className = `pc relative ${row < c.rows ? "border-b border-neutral-950/50" : ""}`;
				const a = document.createElement(`a`);
				a.className = `flex flex-col items-center justify-center w-full`;
				// TODO CHANGE IMG TO SVG
				const pcSvg = document.importNode(PC_TEMPLATE.content, true);
				// const img = document.createElement(`img`)
				// img.className = `object-scale-down w-4 xs:w-7 sm:w-10`
				// img.src = `images/monitor.png`

				const p = document.createElement(`p`);
				p.setAttribute(`data-username`, '');
				p.className = `w-[8ch] text-ellipsis overflow-hidden`;
				p.textContent = `pasquale`;

				if (pc++ % 2 != 0) {
					a.append(p);
					a.append(pcSvg);
				} else {
					a.append(pcSvg);
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
	});
	_updateClusterRef();
}

function _updateClusterRef() {
	CLUSTER_TABLES = CLUSTERS_SECTION.querySelectorAll(`#tab-clusters table`);
}

generateCluster();
_updateClusterRef();