const CLUSTERS_SECTION = document.querySelector(`#tab-clusters`);
var CLUSTER_TABLES;

function updateCluster() {
	CLUSTER_TABLES.forEach((cluster, clusterIdx) => {
		const rows = cluster.querySelectorAll(`tbody tr`);
		rows.forEach((cRow, cRowIdx) => {
			const pcs = cRow.querySelectorAll(`.pc`);
			pcs.forEach((crPc, crPcIdx) => {
				const [cluster, row, pc] = [clusterIdx + 1, rows.length - cRowIdx, crPcIdx + 1];
				const user = findUserByPosition(cluster, row, pc);
				const colors = CLUSTERS[cluster].pcColors;

				const pcSvg = crPc.querySelector(`[data-svg="pc"]`);
				const pcSvgFill = pcSvg.querySelector(`path`);

				crPc.classList.toggle(`!pointer-events-none`, !user);

				const isUserMatched = user != null && isSearchValueIncluded(user.username);
				const isClusterMatched = isSearchValueIncluded(`c${cluster}r${row}p${pc}`) || isSearchValueIncluded(CLUSTERS[cluster].name);
				const userLink = crPc.querySelector(`a`);

				/** @type {HTMLParagraphElement} */
				const usernameP = userLink.querySelector(`[data-username]`);
				usernameP.textContent = user ? user.username : `n/a`;
				usernameP.setAttribute(`data-username`, usernameP.textContent);
				usernameP.classList.toggle(`!text-neutral-600`, !user);

				// userLink.classList.toggle(`!font-medium`, false);
				userLink.referrerPolicy = 'noreferrer';
				userLink.target = user ? `_blank` : ``;
				userLink.href = user ? `https://profile.intra.42.fr/users/${user.username}` : `#`;

				userLink.classList.toggle(`!text-neutral-600`, !user);
				userLink.classList.toggle(`!pointer-events-none`, !user);
				userLink.classList.toggle(`!text-amber-400`, isUserMatched);

				pcSvgFill.style.fill = searchValue() == '' && user && !isUserMatched && !isClusterMatched ? colors.active.default : colors.inactive.matched;
				if (isUserMatched || isClusterMatched)
					pcSvgFill.style.fill = colors.active.matched;

				if (!user)
					pcSvgFill.style.fill = colors.inactive.default;
			});
		});
	});
}



function generateCluster() {
	Object.values(CLUSTERS).forEach(c => {
		const fieldset = document.createElement(`fieldset`);
		fieldset.setAttribute(`data-cluster`, c.id);
		fieldset.className = `flex justify-center w-full p-1 border-t border-b xl: max-w-7xl xl:border xl:rounded-lg shrink-0 border-neutral-950 ${c.isWeird ? `weird` : ``}`;

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

		for (let row = c.rows; row >= 1; row--) {
			const tr = document.createElement(`tr`);
			let pc = 1;
			for (let i = 0; i < c.columns + 1; i++) {
				const td = document.createElement(`td`);

				if (i === 0 || c.spacerColumns.includes(i)) {
					const div = document.createElement(`div`);
					if (i === 0) {
						div.className = `w-5 h-5 text-xs font-extrabold text-center xs:text-sm sm:text-base`;
						div.textContent = `R${row}`;
					}
					else {
						div.className = c.spacerColumns.length > 1 ? `w-3 sm:w-5` : `w-5 sm:w-10`;
					}
					td.append(div);
					tr.append(td);
					continue;
				}
				td.className = `pc relative ${row > 1 ? "border-b border-neutral-950/50" : ""}`;
				const a = document.createElement(`a`);
				a.className = `flex flex-col items-center justify-center w-full`;

				const pcSvg = document.importNode(PC_TEMPLATE.content, true);
				if (c.isWeird) {
					const rotation = c.rotations[row][pc - 1] ? "rotate-180" : "rotate-0";
					pcSvg.childNodes.forEach(el => el.nodeType === 1 ? el.classList.add(rotation) : null);
				}

				const p = document.createElement(`p`);
				p.textContent = `n/a`;
				p.setAttribute(`data-username`, p.textContent);
				p.className = `w-[8ch] text-ellipsis overflow-hidden text-white`;

				if ((pc % 2 != 0 && !c.isWeird) || (c.isWeird && c.rotations[row][pc - 1])) {
					a.append(p);
					a.append(pcSvg);
				} else {
					a.append(pcSvg);
					a.append(p);
				}
				pc++;
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

	CLUSTER_TABLES = CLUSTERS_SECTION.querySelectorAll(`#tab-clusters table`);
}

generateCluster();