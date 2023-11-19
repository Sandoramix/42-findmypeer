/**@type {HTMLDialogElement | null} */
const dialog = document.getElementById(`msg`);

const closeBtn = dialog.querySelector(`[data-dialog-btn="close"]`);
closeBtn.addEventListener(`click`, (ev) => {
	if (dialog) {
		dialog.close();
		dialog.classList.toggle(`!flex`, false);
	}
});
const dialogContent = dialog.querySelector(`[data-dialog-content]`);

function showMessage(message, isError = false) {
	if (!dialog || !dialogContent)
		return;
	dialogContent.innerHTML = message;
	dialogContent.classList.toggle(`text-red-500`, isError);
	dialog.show();
	dialog.classList.toggle(`!flex`, true);
}