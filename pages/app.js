import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import cards, { defaultCard } from 'public/cards';

/* helpful links
lightbox - https://www.wix.com/velo/forum/community-discussion/data-from-the-dynamic-page-in-the-lightbox
custom element example: https://www.wix.com/velo/example/dropdown-custom-element
custom element communcation: https://www.wix.com/velo/reference/$w/customelement/on
*/

const appCarouselSelector = '#AppCarousel';

const pageCommands = {
    openModal: function(context) {
        wixWindow.openLightbox('Modal', context);
    },
    nextCard: function () {
        
    },
    previousCard: function() {

    }
};

$w.onReady(function () {
    const queryParamCard = () => (wixLocation.query && wixLocation.query.card) || defaultCard;
	$w(appCarouselSelector).setAttribute('card', queryParamCard());

    const viewport = wixWindow.formFactor.toLocaleLowerCase();
    $w(appCarouselSelector).setAttribute('viewport', viewport);

    // open modal from carousel
    $w(appCarouselSelector).on('open-modal', function(e) {
        const cardFromQuery = queryParamCard();
        const modalContext = {
            card: cards[cardFromQuery],
        };
        pageCommands.openModal(modalContext);
    });
});