import cards, { data as cardData, defaultCard } from 'public/cards';

class AppCarousel extends HTMLElement {
  constructor() {
    super();
    this.root = document.createElement('div');
  }

  static get observedAttributes() {
    return ['card', 'deck', 'viewport', 'refresh', 'shuffle'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'card') {
      this.forceFirstCard(JSON.parse(newValue));
    } else if (name === 'refresh' && oldValue !== null) {
      const card = this.getCardAttribute();
      this.forceFirstCard(JSON.parse(card));
    } else if (name === 'shuffle' && oldValue !== null) {
      this.shuffle()
    }
  }

  getCardAttribute() {
    return this.getAttribute('card') || defaultCard;
  }

  getDeckAttribute(currentCard) {
    return JSON.parse(this.getAttribute('deck')) || new cards(currentCard);
  }

  getViewportAttribute() {
    return this.getAttribute('viewport') || 'mobile';
  }

  connectedCallback() {
    const currentCard = this.getCardAttribute();
    const deck = this.getDeckAttribute(currentCard);
    const vp = this.getViewportAttribute();
    const stackTotal = vp === 'mobile' ? 5 : 14;

    this.root.id = "carousel-wrapper";
    this.appendChild(this.root);
    this.appendChild(this.createStyle());
    // the visual representation
    this.stack = deck.data;
    this.mount();
  }

  shuffle() {
    const vp = this.getViewportAttribute();
    const self = this;
    const container = this.root.querySelector('#carousel-container');
    const allTheCards = [...this.root.querySelectorAll('.card')];

    // step-one : bring all the cards together
    function stepOne() {
      return new Promise(resolveStepOne => {
        // need a better shared reference to all of the cards
        const transitions = allTheCards.map((cardEl, i) => {
          return new Promise(resolve => {
            if (i === 0) {
              self.unmakeFirstCard(cardEl);
            }
            cardEl.addEventListener('transitionend', function stepOneTransition () {
              cardEl.removeEventListener('transitionend', stepOneTransition);
              resolve();
            });
            const transition = 'top 1s';
            cardEl.style.transition = transition;
            cardEl.style.webkitTransition = transition;
            cardEl.style.MozTransition = transition;
            cardEl.style.msTransition = transition;
            cardEl.style.OTransition = transition;
            cardEl.style.top = '-1px';
          })
        });
        Promise.all(transitions).then(() => {
          resolveStepOne();
        });
      })
    }

    // step two: slide down
    function stepTwo() {
      return new Promise(resolveStepTwo => {
        const animations = allTheCards.map((cardEl, i) => {
          return new Promise(resolve => {
            cardEl.addEventListener('animationend', function stepTwoAnimation() {
              cardEl.removeEventListener('animationend', stepTwoAnimation);
              resolve();
            })
            cardEl.style.animationDelay = `${0.1 * (i + 1)}s`;
            cardEl.classList.add('slide-down');
          })
        })
        Promise.all(animations).then(() => {
          resolveStepTwo();
        });
      })
    }
    // move shuffle nodes to own step
    // step three: shuffle nodes, move z-index
    function stepThree() {
      const shuffleNodes = a => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }
      const nodes = shuffleNodes([...allTheCards]);
      const root = self.root.querySelector('#carousel-container');
      const transitions = nodes.map((cardEl, i) => {
        return new Promise(resolve => {
          // transition this movement
          cardEl.style.zIndex = `${nodes.length - i}`;
          // move node
          root.appendChild(cardEl);
          resolve();
        })
      })
      return new Promise(resolveStepThree => {
        Promise.all(transitions).then(() => {
          resolveStepThree()
        })
      })
    }

    // step four: slide up
    function stepFour() {
      const animations = [...self.root.querySelectorAll('.card')].map((cardEl, i) => {
        return new Promise(resolve => {
          cardEl.addEventListener('animationend', function stepFourAnimation() {
            cardEl.removeEventListener('animationend', stepFourAnimation);
            resolve();
          })
          cardEl.style.animationDelay = `${0.1 * (i + 1)}s`;
          cardEl.classList.add('slide-up');
        })
      });

      return new Promise(resolveStepFour => {
        Promise.all(animations).then(() => {
          resolveStepFour();
        });
      })
    }
    // step five: some clean up
    function stepFive() {
      return new Promise(resolveStepFive => {
        self.root.querySelectorAll('.card').forEach((cardEl, i) => {
          cardEl.classList.remove('slide-up');
          cardEl.classList.remove('slide-down');
        });
        // this is a crutch for the next step
        // without this the last card in the step six loop doesn't respect the transition
        const tempTimeout = setTimeout(() => {
          resolveStepFive();
          clearTimeout(tempTimeout);
        }, 50);
      })
    }
    
    // step six: set default
    function stepSix() {
      const animations = [...self.root.querySelectorAll('.card')].map((cardEl, i) => {
        return new Promise(resolve => {
          cardEl.addEventListener('transitionend', function stepFourAnimation() {
            cardEl.removeEventListener('transitionend', stepFourAnimation);
            resolve();
          });
          const transition = 'top 1s';
          cardEl.style.transition = transition;
          cardEl.style.webkitTransition = transition;
          cardEl.style.MozTransition = transition;
          cardEl.style.msTransition = transition;
          cardEl.style.OTransition = transition;
          cardEl.style.top = `${10 * i}px`;
        })
      });

      return new Promise(resolveStepSix => {
        Promise.all(animations).then(() => {
          resolveStepSix();
        });
      })
    }

    function stepSeven() {
      return new Promise(resolveStepSeven => {
        const firstCard = document.querySelector('.card');
        const firstCardData = JSON.parse(firstCard.dataset.card);
        self.makeFirstCard(firstCard, firstCardData);
        resolveStepSeven();
      })
    }

    function shuffleAnimation() {
      Promise.resolve().then(stepOne).then(stepTwo).then(stepThree).then(stepFour).then(stepFive).then(stepSix).then(stepSeven);
    }

    shuffleAnimation();
  }

  forceFirstCard(card) {
    const first = this.root.querySelector('#first');
    // on fade out
    first.addEventListener('animationend', () => {
      // get data on card
      const firstCardData = JSON.parse(first.dataset.card);
      // make new card because it is easier to remove classes, event listeners, animaitons, etc
      const cardToAddHtml = this.createCard(firstCardData, cardData.length - 1);
      // append new card
      this.root.querySelector('#carousel-container').append(cardToAddHtml);
      // remove old one
      first.remove();
    })
    // fade out and remove card
    first.classList.add('fade-out');
    // new first card
    const newFirstCard = card
    // make the html representation of the new first card
    const newFirstCardHtml = this.createCard(newFirstCard, 0);
    // add DOM components to new first card html
    this.makeFirstCard(newFirstCardHtml, card);
    // add next card HTML
    newFirstCardHtml.classList.add('invisible');
    newFirstCardHtml.addEventListener('animationend', () => {
      newFirstCardHtml.classList.remove('fade-in');
      newFirstCardHtml.classList.remove('invisible');
    });

    this.root.querySelector('#carousel-container').prepend(newFirstCardHtml);
    newFirstCardHtml.classList.add('fade-in');
  }

  createCard(card, pos) {
    const vp = this.getViewportAttribute();
    const cardContainer = document.createElement('div');
    const cardInner = document.createElement('div');
    const cardFront = document.createElement('div');
    const cardBack = document.createElement('div');

    cardFront.classList.add('card-front');
    
    cardFront.style.backgroundImage = `url(${card.front})`;

    cardBack.style.backgroundImage = `url(${card.backColor})`;
    cardBack.classList.add('card-back');

    if (vp === 'mobile') {
      cardContainer.style.top = `${10 * pos}px`;
    } else {
      // container width divided by the amount of cards
      cardContainer.style.right = `${45 * pos}px`;
    }
    cardContainer.style.zIndex = `${cardData.length - pos}`;
    cardContainer.classList.add('card');
    cardContainer.dataset.card = JSON.stringify(card);
    
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
    let pullX;
    let startX;
    // if this is still false when touchend runs, it was a tap, not a swipe
    let isAnimated = false;

    function openModal() {
      self.dispatchEvent(new CustomEvent('open-card-modal', { detail: { card: card }}));
    }

    function pull(pullX) {
      const deg = pullX / 10;
      cardContainer.style.transform = `translateX(${pullX}px) rotate(${deg}deg)`;
    }

    function release(pullX) {
      const threshold = 20;

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

    function move(moveEvent) {
      const moveX = moveEvent.targetTouches ? moveEvent.targetTouches[0].pageX : moveEvent.pageX;
      isAnimated = true;
      pullX = moveX - startX;
      pull(pullX)
    }

    function end(endEvent) {
      if(!endEvent) return;
      if (isAnimated) {
        release(pullX);
      } else {
        openModal()
      }
      cardContainer.removeEventListener('mousemove', move);
    }

    function clearEvents() {
      cardContainer.removeEventListener('mousemove', move);
    }

    function handleTouch(touchStartEvent) {
      touchStartEvent.stopPropagation();
      // prevent window level swipes
      touchStartEvent.preventDefault();
      startX =  touchStartEvent.targetTouches[0].pageX;
      cardContainer.addEventListener('touchmove', move);
      cardContainer.addEventListener('touchend', end);
    }

    function handleDrag (mouseDownEvent) {
      // mouseDownEvent.stopPropagation();
      // mouseDownEvent.preventDefault();
      startX = mouseDownEvent.pageX;
      cardContainer.addEventListener('contextmenu', clearEvents)
      cardContainer.addEventListener('mousemove', move);
      cardContainer.addEventListener('mouseup', end);
    }
  
    cardContainer.id = 'first';
    cardContainer.addEventListener('mousedown', handleDrag, false);
    cardContainer.addEventListener('touchstart', handleTouch, false);

    cardContainer.querySelector('.card-inner').classList.add('flip');

    return cardContainer;
  }
  // remove everything from first card that makes it special. classes, ids, animations, events
  unmakeFirstCard() {
    const cardHtml = this.root.querySelector('#first');
    cardHtml.removeAttribute('id');
    cardHtml.querySelector('.card-inner').classList.remove('flip');
    cardHtml.classList.remove('release-left');
    cardHtml.classList.remove('release-right');
    // clone node removes event listeners
    return cardHtml.cloneNode(true);
  }

  next () {
    const vp = this.getViewportAttribute();
    // get first card data and then remove it
    // Easier to get rid of everything on it. Event listners, classes, etc
    const firstCardHtml = this.root.querySelector('#first');
    const firstCardData = JSON.parse(firstCardHtml.dataset.card);
    firstCardHtml.remove();

    // remake the html representation of the removed first card
    const nextPos = cardData.length - 1;
    const cardToAddHtml = this.createCard(firstCardData, nextPos);
    // move the cards visually
    const moveNodeList = this.root.querySelectorAll('.card:not(#first)');
    moveNodeList.forEach(card => {
      function animateTop() {
        const transition = 'top 1s';
        card.style.webkitTransition = transition;
        card.style.MozTransition = transition;
        card.style.msTransition = transition;
        card.style.OTransition = transition;
        card.style.top = `${parseInt(card.style.top.split('px')[0]) - 10}px`;
        card.style.zIndex = parseInt(card.style.zIndex) + 1;
      }
      function animateRight() {
        const transition = 'right 1s';
        card.style.webkitTransition = transition;
        card.style.MozTransition = transition;
        card.style.msTransition = transition;
        card.style.OTransition = transition;
        card.style.right = `${parseInt(card.style.right.split('px')[0]) - 45}px`;
        card.style.zIndex = parseInt(card.style.zIndex) + 1;
      }

      if (vp === 'desktop') {
        animateRight();
      } else if (vp === 'mobile') {
        animateTop();
      }
    });
    const newFirstCardHtml = moveNodeList.item(0)
    const newFirstCardData = JSON.parse(newFirstCardHtml.dataset.card);
    // add DOM components to new first card html
    this.makeFirstCard(newFirstCardHtml, newFirstCardData);
    // add next card HTML
    this.root.querySelector('#carousel-container').appendChild(cardToAddHtml);
  }

  createStyle () {
    const styleElement = document.createElement('style');
    const vp = this.getViewportAttribute();
    styleElement.innerHTML = `
        app-carousel {
          display: flex;
          height: 100%;
          height: -moz-available;
          height: -webkit-fill-available;
          width: 100%;
          justify-content: center;
          margin-left: auto;
          margin-right: auto;
        }
        #carousel-wrapper {
          max-height: 350px;
          width: 100%;
          height: 100%;
          ${vp === 'mobile' ? `
            max-width: 300px;
          ` : ``}
        }
        #carousel-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .card {
          position: absolute;
          ${vp === 'mobile' ? `
            left: 0;
            right: 0;
            height: 300px;
            transform: perspective(100em) rotateX(55deg);
          `: `
            width: 300px;
            height: 350px;
          `}
        }
        .card-front {
          background-position: center;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        #first {
          z-index: 20 !important;
        }
        .flip {
          animation-duration: 1s;
          animation-name: flip;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
        }
        @keyframes flip {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(180deg);
          }
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
          border-radius: 8px;
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
        .fade-out {
          animation-duration: 1s;
          animation-name: fadeout;
        }
        .invisible {
          opacity: 0;
        }
        .fade-in {
          animation-duration: 1s;
          animation-name: fadein;
        }
        .slide-down {
          animation-duration: 1s;
          animation-name: slidedown;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
        }
        .slide-up {
          animation-duration: 1s;
          animation-name: slideup;
          animation-iteration-count: 1;
          animation-fill-mode: backwards;
        }
        @keyframes fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeout {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @keyframes slidedown {
          from {
            top: 0px;
          }
          to {
            top: 400px;
          }
        }
        @keyframes slideup {
          from {
            top: 400px;
          }
          to {
            top: 0px;
          }
        }
      `;
    return styleElement;
  };

  mount() {
    this.root.innerHTML = `<div id="carousel-container"></div>`;

    const container = this.root.querySelector('#carousel-container');
    this.stack.forEach((card, pos) => {
      container.append(this.createCard(card, pos));
    });
  }
}

customElements.define('app-carousel', AppCarousel);
