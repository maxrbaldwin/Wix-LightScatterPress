import wixWindow from 'wix-window';

$w.onReady(function () {
	const context = wixWindow.lightbox.getContext();
	$w('#CardModal').setAttribute('card', context);
});