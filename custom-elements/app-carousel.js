import cards, { defaultCard } from 'public/cards';

class AppCarousel extends HTMLElement {
  constructor() {
    super();
    this.root = document.createElement('div');
  }

  static get observedAttributes() {
    return ['card', 'deck', 'viewport'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  getCardAttribute() {
    return this.getAttribute('card') || defaultCard;
  }

  connectedCallback() {
    this.root.id = "carousel-wrapper";
    this.appendChild(this.root);
    this.appendChild(this.createStyle());
    this.render();
  }

  createCard(card, i) {
      const cardContainer = document.createElement('div');
      const cardTitle = document.createElement('h2');
      const self = this;
      // To be in the same scope as the root for dispatch purposes.
      // The click event "this" is the card. Not the custom element.
      function openModal() {
        const cardParameter = self.getCardAttribute();
        self.dispatchEvent(new CustomEvent('open-card-modal'));
      }

      function touchOpenModal(e) {
        if (e.touches.length >= 2 ) {
          openModal();
        }
      }
    
      if (i === 0) {
          const cardText = document.createElement('p');
          cardText.innerHTML = card.desc;
          cardContainer.appendChild(cardText);
          cardContainer.classList.add('first');
          cardContainer.addEventListener('click', openModal, false);
          cardContainer.addEventListener('touchstart', touchOpenModal, false);
        } else {
          cardContainer.classList.add('sub-card');
        }
      
      cardContainer.style.backgroundColor = card.backColor;
      cardContainer.classList.add('card');
      
      return cardContainer;
  }

  createStyle () {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        app-carousel {
            display: flex;
            height: 100%;
            height: -moz-available;
            height: -webkit-fill-available;
            width: 100%;
            justify-content: center;
        }
        #carousel-wrapper {
          width: 100%;
        }
        .card {
          padding: 10px 10px 0px 10px;
          border: 1px solid #000;
        }
        .card.first {
          min-height: 350px;
          border-radius: 3px;
        }
        .card.sub-card {
          min-height: 5px;
          border-bottom-left-radius: 3px;
          border-bottom-right-radius: 3px;
          border-top: 0px;
        }
        #alt-navigation {
          display: flex;
          flex-direction: row;
          border: 1px solid #000;
        }
        .nav-item {
          flex-grow: 1;
          text-align: center;
          min-height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #middleNavItem {
          border-left: 1px solid #000;
          border-right: 1px solid #000;
        }
      `;
    return styleElement;
};

  render() {
    const currentCard = this.getCardAttribute();
    const deck = JSON.parse(this.getAttribute('deck')) || new cards(currentCard);
    const viewport = this.getAttribute('viewport') || 'mobile';

    this.root.innerHTML = `<div id="carousel-container"></div>`;

    const container = this.root.querySelector('#carousel-container');
    deck.data.forEach((card, i) => {
      container.append(this.createCard(card, i))
    });
  }
}

customElements.define('app-carousel', AppCarousel);
