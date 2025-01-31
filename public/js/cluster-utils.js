const CLUSTERS_SECTION = document.querySelector(`#tab-clusters`);

/**@type {undefined | HTMLTableElement[]} */
var CLUSTER_TABLES = undefined;

function updateCluster(expanded = false) {
	if (!CLUSTERS || !PEERS)
		return;

	CLUSTER_TABLES.forEach((cluster, clusterIdx) => {
		const clusterConfig = findClusterConfigById(+cluster.getAttribute('data-table-of-cluster'));
		if (!clusterConfig)
			return;
		const rows = cluster.querySelectorAll(`tbody tr`);
		rows.forEach((cRow, cRowIdx) => {
			const pcs = cRow.querySelectorAll(`.pc`);
			pcs.forEach((crPc, crPcIdx) => {
				const [cluster, row, pc] = [clusterConfig.id, rows.length - cRowIdx, crPcIdx + 1];
				const user = findUserByPosition(cluster, row, pc);
				const colors = clusterConfig.pcColors;

				const pcSvg = crPc.querySelector(`[data-svg="pc"]`);
				const pcSvgFill = pcSvg.querySelector(`path`);

				// crPc.classList.toggle(`!pointer-events-none`, !user);

				const isUserMatched = user != null && isSearchValueIncluded(user.username);
				const isClusterMatched = isSearchValueIncluded(`c${cluster}r${row}p${pc}`) || isSearchValueIncluded(clusterConfig.name);
				const userLink = crPc.querySelector(`a`);

				crPc.title = `c${cluster}r${row}p${pc}`;
				if (user){
					crPc.title += `: ${user.username}`;
				}

				/** @type {HTMLParagraphElement} */
				const usernameP = userLink.querySelector(`[data-username]`);
				usernameP.textContent = user ? user.username : ``;
				usernameP.setAttribute(`data-username`, usernameP.textContent);
				usernameP.classList.toggle(`!text-neutral-600`, !user);

				userLink.classList.toggle(`!font-medium`, expanded);
				usernameP.classList.toggle(`!font-medium`, expanded);
				userLink.referrerPolicy = 'noreferrer';
				userLink.target = user ? `_blank` : ``;
				userLink.href = user ? `https://profile.intra.42.fr/users/${user.username}` : ``;

				userLink.classList.toggle(`!text-neutral-600`, !user);
				userLink.classList.toggle(`!pointer-events-none`, !user);
				userLink.classList.toggle(`!text-amber-400`, isUserMatched);

				pcSvgFill.style.fill = searchValue() == '' && user && !isUserMatched && !isClusterMatched ? colors.active.default : colors.inactive.matched;
				if (isUserMatched || isClusterMatched)
					pcSvgFill.style.fill = colors.active.matched;

				if (!user)
					pcSvgFill.style.fill = colors.inactive.default;
				if (!user && (isUserMatched || isClusterMatched) && colors.empty && colors.empty.matched)
					pcSvgFill.style.fill = colors.empty.matched;
			});
		});
	});
}



function generateCluster(clusterConfig, parentNode, expanded = false, whiteBorder = false) {
	const fieldset = document.createElement(`fieldset`);
	fieldset.setAttribute(`data-cluster`, clusterConfig.id);
	fieldset.className = `flex justify-center w-full max-h-screen p-1 ${expanded ? `px-16 py-8` : `max-w-7xl xl:border xl:border-black/30 border-t border-b bg-black/5`} shrink-0 ${whiteBorder ? ` border-neutral-200/50` : `border-neutral-950`} ${clusterConfig.isWeird ? `weird` : ``}`;

	const legend = document.createElement(`legend`);
	legend.className = expanded ? `w-96` : `w-60`;
	legend.setAttribute('align', 'center')
	legend.innerHTML = `<a href="/cluster?id=${clusterConfig.id}" class="w-full flex justify-center items-center">
		<div class="font-arial uppercase font-bold text-center ${expanded ? `text-sm sm:text-3xl` : `text-sm sm:text-base lg:text-lg`} grid grid-cols-7 grid-flow-row items-center w-full">
			<h3 class="col-span-3 row-span-1">Cluster ${clusterConfig.id}</h3>
			<h3 class="col-span-1 row-span-1">||</h3>
			<h3 class="col-span-3 row-span-1">${clusterConfig.name}</h3>
		</div>
	</a>`;

	const table = document.createElement(`table`);
	table.setAttribute(`data-table-of-cluster`, clusterConfig.id);
	table.className = `w-full grow ${expanded ? `text-xxs xs:text-sm 3xl:text-base` : clusterConfig.columns > 14 ? "text-xxxs sm:text-xxs md:text-xs xl:text-sm 3xl:text-base" : "text-xxxs xs-sm:text-xxxm md:text-xs xl:text-sm 3xl:text-base"}`;

	const thead = document.createElement(`thead`);
	const theadTr = document.createElement(`tr`);
	theadTr.className = ` ${expanded ? `text-sm xs:text-base sm:text-3xl` : `text-xxs text-center xs:text-sm sm:text-base`}`;
	let p = 1;
	for (let i = 0; i < clusterConfig.columns + 1; i++) {
		const th = document.createElement(`th`);
		if (i === 0) {
			th.className = `relative`;
		} else {
			const div = document.createElement(`div`);
			div.className = `font-extrabold`;
			div.textContent = !clusterConfig.spacerColumns.includes(i) ? `P${p++}` : ``;
			th.append(div);
		}
		theadTr.append(th);
	}
	thead.append(theadTr);
	table.append(thead);

	const tbody = document.createElement(`tbody`);
	tbody.className = `font-light`;

	for (let row = clusterConfig.rows; row >= 1; row--) {
		const tr = document.createElement(`tr`);
		let pc = 1;
		for (let i = 0; i < clusterConfig.columns + 1; i++) {
			const td = document.createElement(`td`);

			if (i === 0 || clusterConfig.spacerColumns.includes(i)) {
				const div = document.createElement(`div`);
				if (i === 0) {
					div.className = `w-3 h-3 xs:w-5 xs:h-5 font-extrabold text-center ${expanded ? `text-sm xs:text-base sm:text-3xl mx-2` : `text-xxs xs:text-sm sm:text-base`}`;
					div.textContent = `R${row}`;
				}
				else {
					div.className = clusterConfig.spacerColumns.length > 1 && !expanded ? `w-0 xs:w-2 sm:w-4 lg:w-8` : `w-1 xs:w-3 sm:w-6 lg:w-10`;
				}
				td.append(div);
				tr.append(td);
				continue;
			}
			td.className = `pc relative ${expanded ? `` : `py-1 sm:py-2`} ${row > 1 ? `border-b ${whiteBorder ? `border-neutral-300/40` : `border-neutral-950/50`}` : ""}`;
			const a = document.createElement(`a`);
			a.className = `flex flex-col items-center justify-center w-full`;

			const pcSvg = document.importNode(PC_TEMPLATE.content, true);
			if (clusterConfig.isWeird) {
				const rotation = clusterConfig.rotations[row][pc - 1] ? "rotate-180" : "rotate-0";
				pcSvg.childNodes.forEach(el => {
					if (el.nodeType === 1){
						el.classList.add(rotation)
					}
				});
			}

			const p = document.createElement(`p`);
			p.textContent = ``;
			p.setAttribute(`data-username`, p.textContent);
			p.className = `w-[9ch] text-ellipsis overflow-hidden text-white font-mono`;

			if ((pc % 2 != 0 && !clusterConfig.isWeird) || (clusterConfig.isWeird && clusterConfig.rotations[row][pc - 1])) {
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
	if (parentNode) {

		parentNode.append(fieldset);
	}

	CLUSTER_TABLES.push(table);
}