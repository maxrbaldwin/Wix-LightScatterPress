import wixWindow from 'wix-window';

$w.onReady(function () {
	$w('#DirectoryModal').on('close-directory-modal', e => {
		wixWindow.lightbox.close({ ...e.detail.card });
	})
});