import wixWindow from 'wix-window';

$w.onReady(function () {
	const context = wixWindow.lightbox.getContext();
	const vp = wixWindow.formFactor
	$w('#CardModal').setAttribute('card', JSON.stringify(context.card));
	$w('#CardModal').setAttribute('viewport', vp);

	$w('#CardModal').on('close-card-modal', () => {
		wixWindow.lightbox.close();
	})
});