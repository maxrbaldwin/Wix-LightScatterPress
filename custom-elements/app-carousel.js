import cards, { data as cardData, defaultCard } from 'public/cards';

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
          cardContainer.style.backgroundColor = '#fff';
          cardContainer.addEventListener('click', openModal, false);
          cardContainer.addEventListener('touchstart', touchOpenModal, false);
        } else {
          cardContainer.classList.add('sub-card');
          cardContainer.style.backgroundImage = `url(${card.backColor})`;
        }
      cardContainer.style.top = `${20 * i}px`;
      cardContainer.style.zIndex = `${cardData.length - i}`;
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
        #carousel-container {
          position: relative;
        }
        .card {
          padding: 10px 10px 0px 10px;
          border: 1px solid #000;
          min-height: 350px;
          position: absolute;
          border-radius: 8px;
          left: 0;
          right: 0;
          background-position: center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        // .sub-card {
        //   background-image: url("https://res.cloudinary.com/maxrbaldwin-com/image/upload/v1611865301/Wix-LightScatterPress/cardback.png");
        //   background-position: center;
        //   background-repeat: no-repeat;
        //   background-size: 100% 100%;
        // }
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
