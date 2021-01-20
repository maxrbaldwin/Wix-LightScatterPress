import cards, { defaultCard } from 'public/cards';

class AppCarousel extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['card', 'viewport'];
  }

  getCardAttribute() {
    return this.getAttribute('card') || defaultCard;
  }

  connectedCallback() {
    const cardParameter = this.getCardAttribute();
    const viewport = this.getAttribute('viewport') || 'mobile';

    if (viewport === 'mobile') {

    }
    // base
    const wrapper = this.createWrapper();
    wrapper.appendChild(this.createContainer(cardParameter))
    // wrapper.appendChild(createNavigation());

    this.appendChild(this.createStyle());
    this.appendChild(wrapper);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('change: ', name, oldValue, newValue);
  }

  createWrapper () {
      const wrapper = document.createElement('div')
      wrapper.id = 'carousel-wrapper';
      return wrapper;
  }

  createContainer(cardParameter) {
      const container = document.createElement('div');
      container.id = 'carousel-container';

      const cardsInOrder = {
        ...(cardParameter && { [cardParameter]: cards[cardParameter] }), 
        ...cards
      };

      Object.keys(cardsInOrder).forEach((key, i) => {
        const card = cards[key];
        const cardHtml = this.createCard(card, i);

        container.appendChild(cardHtml);  
      })

      return container;
  }

  createCard(card, i) {
      const cardContainer = document.createElement('div');
      const cardTitle = document.createElement('h2');
      const root = this;
      // To be in the same scope as the root for dispatch purposes.
      // The click event "this" is the card. Not the custom element.
      function openModal(e) {
        const cardParameter = root.getCardAttribute();
        root.dispatchEvent(new CustomEvent('open-modal', { detail: { card: cardParameter }}));
      }
    
      if (i === 0) {
          const cardText = document.createElement('p');
          cardText.innerHTML = card.desc;
          cardContainer.appendChild(cardText);
          cardContainer.classList.add('first');
          cardContainer.addEventListener('click', openModal);
          cardContainer.addEventListener('touchstart', openModal);
        } else {
          cardContainer.classList.add('sub-card');
        }

      // cardTitle.innerHTML = card.title;
      // cardContainer.appendChild(cardTitle);
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
        .card {
          padding: 10px;
          border: 1px solid #000;
        }
        .card.first {
          background-color: #ff0000;
          min-height: 350px;
          border-radius: 3px;
        }
        .card.sub-card {
          background-color: #0000ff;
          min-height: 10px;
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
    console.log('render: ', this.card);
  }
}

customElements.define('app-carousel', AppCarousel);
