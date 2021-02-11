import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import cards, { defaultCard } from 'public/cards';

/* helpful links
lightbox - https://www.wix.com/velo/forum/community-discussion/data-from-the-dynamic-page-in-the-lightbox
custom element example: https://www.wix.com/velo/example/dropdown-custom-element
custom element communcation: https://www.wix.com/velo/reference/$w/customelement/on
*/

const appCarouselSelector = '#AppCarousel';
const appNavigationSelector = '#AppNavigation';

const pageCommands = {
    openCardModal: function(context) {
        wixWindow.openLightbox('CardModal', context)
            .catch(err => {
                console.log('Catch in open card modal: ', err);
            });
    },
    openDirectoryModal: function(deck) {
        wixWindow.openLightbox('DirectoryModal')
			.then(card => {
                if (card) {
                    deck.selectCard(card);
        		    $w(appCarouselSelector).setAttribute('card', JSON.stringify(card));
                }
				$w(appCarouselSelector).scrollTo();
			})
            .catch(err => {
                console.log('Catch in open directory modal: ', err);
            });
    },
    nextCard: function (deck) {
        return deck.nextCard();
    },
    previousCard: function(deck) {
        return deck.previousCard();
    }
};

$w.onReady(function () {
    const queryParamCard = (wixLocation.query && wixLocation.query.card) || defaultCard;
    const deck = new cards(queryParamCard);
	const viewport = wixWindow.formFactor.toLocaleLowerCase();

    $w('#quickActionBar1').collapse()

    // open card modal from carousel
    $w(appCarouselSelector).on('open-card-modal', function(e) {
        const modalContext = {
            card: e.detail.card,
        };
        pageCommands.openCardModal(modalContext);
    });
	
	// open directory modal from navigation
    $w(appNavigationSelector).on('open-directory-modal', function(e) {
        pageCommands.openDirectoryModal(deck);
    });

	// navigate to next card
    $w(appNavigationSelector).on('next-card', function(e) {
        const nextCard = pageCommands.nextCard(deck);
        $w(appCarouselSelector).setAttribute('deck', JSON.stringify(deck));
        $w(appCarouselSelector).setAttribute('card', deck.currentCard);
    });

	// navigate to previous card
    $w(appNavigationSelector).on('previous-card', function(e) {
        const previousCard = pageCommands.previousCard(deck);
        $w(appCarouselSelector).setAttribute('deck', JSON.stringify(deck));
        $w(appCarouselSelector).setAttribute('card', deck.currentCard);
    });

	$w(appCarouselSelector).setAttribute('deck', JSON.stringify(deck));
    // $w(appCarouselSelector).setAttribute('card', deck.currentCard);
    $w(appCarouselSelector).setAttribute('viewport', viewport);
});