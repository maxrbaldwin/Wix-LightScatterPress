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
    console.log('new: ', name, newValue, oldValue)
    if (name === 'card') {
      this.forceFirstCard(JSON.parse(newValue));
    }
  }

  getCardAttribute() {
    return this.getAttribute('card') || defaultCard;
  }

  getDeckAttribute(currentCard) {
    return JSON.parse(this.getAttribute('deck')) || new cards(currentCard);
  }

  connectedCallback() {
    const currentCard = this.getCardAttribute();
    const deck = this.getDeckAttribute(currentCard);

    this.root.id = "carousel-wrapper";
    this.appendChild(this.root);
    this.appendChild(this.createStyle());
    // the data
    this.cards = deck.data;
    // the visual representation
    this.stack = this.cards.splice(0, 5);
    this.mount();
  }

  forceFirstCard(card) {
    // remove first card from html stack of cards
    this.root.querySelector('#first').remove();
    // also remove it from the data representation
    const firstCard = this.stack.splice(0, 1)[0];
    // new first card
    const newFirstCard = card
    // make the html representation of the new first card
    const newFirstCardHtml = this.createCard(newFirstCard, 0);
    // push the new first card to the front of the stack
    this.stack.unshift(newFirstCard);
    // take the first card data that was removed and push it back onto the data of all the cards
    this.cards.push(firstCard);
    // add DOM components to new first card html
    this.makeFirstCard(newFirstCardHtml, card);
    // add next card HTML
    this.root.querySelector('#carousel-container').prepend(newFirstCardHtml);
  }

  createCard(card, pos) {
    const cardContainer = document.createElement('div');
    const cardInner = document.createElement('div');
    const cardFront = document.createElement('div');
    const cardBack = document.createElement('div');
    const cardTitle = document.createElement('h2');
    const self = this;

    const cardText = document.createElement('p');
    cardFront.classList.add('card-front');
    
    if (card.front) {
      cardFront.style.backgroundImage = `url(${card.front})`;
    } else {
      cardText.innerHTML = card.desc;
      cardFront.appendChild(cardText);
    }

    cardBack.style.backgroundImage = `url(${card.backColor})`;
    cardBack.classList.add('card-back');

    cardContainer.style.top = `${20 * pos}px`;
    cardContainer.style.zIndex = `${cardData.length - pos}`;
    cardContainer.classList.add('card');
    
    cardInner.classList.add('card-inner');
    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);

    cardContainer.appendChild(cardInner);

    if (pos === 0) {
      this.makeFirstCard(cardContainer, card);
    }
    
    return cardContainer;
  }

  makeFirstCard(cardContainer, card) {
    const self = this;

    function openModal() {
      self.dispatchEvent(new CustomEvent('open-card-modal', { detail: { card: card }}));
    }

    function handleTouch(touchStartEvent) {
      touchStartEvent.stopPropagation();
      console.log('start', touchStartEvent);
      // if this is still false when touchend runs, it was a tap, not a swipe
      let isAnimated = false;
      // prevent window level swipes
      touchStartEvent.preventDefault();

      const startX =  touchStartEvent.targetTouches[0].pageX;
      let pullX;

      function pull(pullX) {
        const deg = pullX / 10;
        cardContainer.style.transform = `translateX(${pullX}px) rotate(${deg}deg)`;
      }

      function release(pullX) {
        const threshold = 50;

        if (pullX >= threshold) {
          const animationTimer = setTimeout(() => {
            self.next();
            clearTimeout(animationTimer);
          }, 500);
          cardContainer.classList.add('release-right');
        } else if (pullX <= -Math.abs(threshold)) {
          const animationTimer = setTimeout(() => {
            self.next();
            clearTimeout(animationTimer);
          }, 500);
          cardContainer.classList.add('release-left');
        }
      }

      cardContainer.addEventListener('touchmove', function(touchMoveEvent) {
        const moveX = touchMoveEvent.targetTouches[0].pageX;
        isAnimated = true;
        pullX = moveX - startX;
        pull(pullX)
      });

      cardContainer.addEventListener('touchend', function(touchEndEvent) {
        if(!touchEndEvent) return;
        touchEndEvent.stopPropagation();
        if (isAnimated) {
          console.log('end');
          release(pullX);
        } else {
          openModal()
        }
      });
    }
  
    cardContainer.id = 'first';
    cardContainer.addEventListener('click', openModal, false);
    cardContainer.addEventListener('touchstart', handleTouch, false);
    
    const flipDelay = setTimeout(() => {
      cardContainer.querySelector('.card-inner').classList.add('flip');
      clearTimeout(flipDelay);
    }, 500);

    return cardContainer;
  }

  next () {
    // remove first card from html stack of cards
    this.root.querySelector('#first').remove();
    // also remove it from the data representation
    const firstCard = this.stack.splice(0, 1)[0];
    // get the  next card off of all the cards
    const cardToAdd = this.cards.splice(0, 1)[0];
    // make the html representation of the next card
    const cardToAddHtml = this.createCard(cardToAdd, 4);
    // push the next card into the data representation of the stack
    this.stack.push(cardToAdd);
    // take the last card data that was removed and push it back onto the data of all the cards
    this.cards.push(firstCard);
    // move the cards visually
    const moveNodeList = this.root.querySelectorAll('.card:not(#first)');
    moveNodeList.forEach(card => {
      const transition = 'top 1s';
      card.style.webkitTransition = transition;
      card.style.MozTransition = transition;
      card.style.msTransition = transition;
      card.style.OTransition = transition;
      card.style.top = `${parseInt(card.style.top.split('px')[0]) - 20}px`;
      card.style.zIndex = parseInt(card.style.zIndex) + 1;
    });
    const newFirstCardHtml = moveNodeList.item(0)
    // add DOM components to new first card html
    this.makeFirstCard(newFirstCardHtml, this.stack[0]);
    // add next card HTML
    this.root.querySelector('#carousel-container').appendChild(cardToAddHtml);
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
          height: 100%;
        }
        #carousel-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .card {
          height: 300px;
          position: absolute;
          left: 0;
          right: 0;
        }
        #first {
          z-index: 20 !important;
        }
        .flip {
          transform: rotateY(180deg);
        }
        .card-inner {
          position: relative;
          height: 100%;
          width: 100%;
          transition: transform 1s;
          transform-style: preserve-3d;
          border: 1px solid #000;
          border-radius: 8px;
        }
        .card-front {
          background-color: #fff;
          transform: rotateY(180deg);
        }
        .card-back {
          background-position: center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .release-right {
          transition: all 1s !important;
          transform: translateX(10) rotate(180deg) scale(0.8) !important;
          opacity: 0;
        }
        .release-left {
          transition: all 1s !important;
          transform: translateX(-10) rotate(180deg) scale(0.8) !important;
          opacity: 0;
        }
      `;
    return styleElement;
  };

  mount() {
    // const viewport = this.getAttribute('viewport') || 'mobile';

    this.root.innerHTML = `<div id="carousel-container"></div>`;

    const container = this.root.querySelector('#carousel-container');
    this.stack.forEach((card, pos) => {
      container.append(this.createCard(card, pos))
    });
  }
}

customElements.define('app-carousel', AppCarousel);
