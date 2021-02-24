import wixWindow from 'wix-window';

$w.onReady(function () {
	$w('#DirectoryModal').on('close-directory-modal', e => {
		if (e.detail && e.detail.card) {
			wixWindow.lightbox.close({ ...e.detail.card });
		} else {
			wixWindow.lightbox.close();
		}
	})
});