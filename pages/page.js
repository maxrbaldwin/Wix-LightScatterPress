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
				wixWindow.scrollTo(0, 0);
			})
            .catch(err => {
                console.log('Catch in open directory modal: ', err);
            });
    }
};

$w.onReady(function () {
    const queryParamCard = (wixLocation.query && wixLocation.query.card) || defaultCard;
    const deck = new cards(queryParamCard);
	const viewport = wixWindow.formFactor.toLocaleLowerCase();
    const firstCardData = JSON.stringify(deck.getCardInfo(deck.firstCard.toString()));
    let bookmark = 1;
    let shuffle = 1;

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

    $w(appNavigationSelector).on('bookmark', function(e) {
        const getRefresh = () => {
            let temp;
            if (bookmark === 1) {
                temp = 2;
                bookmark = 2;
            } else if (bookmark === 2) {
                temp = 1;
                bookmark = 1;
            }
            return temp;
        }
        // hack to force the deck to change the first card when the "card" attr doesn't change
        $w(appCarouselSelector).setAttribute('bookmark', getRefresh());
        $w(appCarouselSelector).setAttribute('card', firstCardData);
    });

    $w(appNavigationSelector).on('shuffle', function(e) {
        const getShuffle = () => {
            let temp;
            if (shuffle === 1) {
                temp = 2;
                shuffle = 2;
            } else if (shuffle === 2) {
                temp = 1;
                shuffle = 1;
            }
            return temp;
        }

        $w(appCarouselSelector).setAttribute('shuffle', getShuffle());
    })

	$w(appCarouselSelector).setAttribute('deck', JSON.stringify(deck));
    $w(appCarouselSelector).setAttribute('bookmark', bookmark);
    $w(appCarouselSelector).setAttribute('shuffle', shuffle);
    $w(appCarouselSelector).setAttribute('viewport', viewport);
    $w(appNavigationSelector).setAttribute('viewport', viewport);
    $w(appNavigationSelector).setAttribute('card', firstCardData);
});