TABS_BUTTONS.forEach((el, idx) => {
	const elAttr = el.getAttribute(`data-selectedtab`);

	el.addEventListener('click', (ev) => {
		TABS_BUTTONS.forEach(btn => {
			const btnAttr = btn.getAttribute(`data-selectedtab`);
			const targetEl = document.getElementById(`tab-${btnAttr}`);
			if (btnAttr != elAttr) {
				targetEl.style.display = 'none';
				btn.classList.toggle(`!text-yellow-500`, false);
			}
			else {
				targetEl.style.display = 'flex';
				btn.classList.toggle(`!text-yellow-500`, true);
			}
		});
	});
	const hash = location.hash.replace(/^#/, "");
	const included = !![...TABS_BUTTONS].find(el => el.getAttribute(`data-selectedtab`)=== hash)
	const tabSection = document.getElementById(`tab-${elAttr}`);
	if (hash != elAttr && !(!included && idx == 0))
		tabSection.style.display = `none`;
	else {
		tabSection.style.display = `flex`;
		el.classList.toggle(`!text-yellow-500`, true);
	}
});