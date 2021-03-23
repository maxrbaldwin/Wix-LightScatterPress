const playButtonImgSrc = 'https://static.wixstatic.com/media/bb0dab_d728ed43d28d49f296e0a1fbbc9762b2~mv2.png';
const pauseButtonImgSrc = 'https://static.wixstatic.com/media/bb0dab_ae6779a0f3254fb294a20adb6fd4ca03~mv2.png';

class AppCardModal extends HTMLElement {
  constructor() {
    super();
    this.root = document.createElement('div');
    this.player = document.createElement('audio');
  }

  getViewportAttribute() {
    return this.getAttribute('viewport') || 'mobile';
  }

  connectedCallback() {
    this.root.id = 'card-modal-wrapper';
    this.append(this.root);
    this.append(this.createStyle());
    this.render();
  }

  createPageNumberTopper(card) {
    const topper = document.createElement('div');
    const pageNumber = document.createElement('p');
    pageNumber.innerHTML = `p.${card.pageNumber}`;
    topper.id = 'page-number-topper';
    topper.appendChild(pageNumber);
    return topper;
  }

  createCardImage(card) {
    const container = document.createElement('div');
    const image = document.createElement('img');
    const credit = document.createElement('div');
    image.src = card.front || card.backColor;
    image.alt = card.title;
    image.id = 'card-image';
    credit.id = 'image-credit';
    credit.innerHTML = `Illustration By : ${card.imageCredit}`;
    container.id = 'card-image-container';
    container.appendChild(image);
    container.appendChild(credit);
    return container;
  }

  createTitle(currentCard) {
    const title = document.createElement('h2');
    title.innerHTML = currentCard.title;
    return title;
  }

  createDescription(currentCard) {
    const desc = document.createElement('p');
    desc.innerHTML = currentCard.desc;
    desc.id = 'description';
    return desc;
  }

  createInstructions() {
    const instructions = document.createElement('p');
    instructions.innerHTML = 'When you’re ready to go back to print, close this card, then swipe to another, and use the page number to find your way back to the book.';
    instructions.id = 'instructions';
    return instructions;
  }

  createAudioDurationText(totalTime) {
    const container = document.createElement('div');
    // const elapsedContainer = document.createElement('div');
    const elapsed = document.createElement('span');
    const total = document.createElement('span');
    elapsed.id = 'elapsed';
    elapsed.innerText = '0:00';
    total.id = 'total-time';
    total.innerText = '0:00';
    container.id = 'elapsed-container'
    container.appendChild(elapsed);
    container.appendChild(total);
    return container;
  }

  createAudioCredit(currentCard) {
    const container = document.createElement('div');
    const credit = document.createElement('p');
    credit.innerText = `Music By : ${currentCard.musicCredit}`;
    credit.id = 'credit';
    container.appendChild(credit);
    return container; 
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds - minutes * 60);
    const s = remainder < 10 ? `0${remainder}` : remainder;
    return `${minutes}:${s}`;
  }

  createAudio(currentCard) {
    const self = this;
    const container = document.createElement('div');
    const fullTimer = document.createElement('div');
    const movingTimer = document.createElement('div');
    const audio = this.player;
    const source = document.createElement('source');
    container.id = 'audio-container';
    fullTimer.id = 'full-timer';
    movingTimer.id = 'moving-timer';
    source.src = currentCard.audio;
    source.type = 'audio/wav';
    audio.id = 'audio-player';
    audio.addEventListener('ended', function() {
      audio.currentTime = 0;
      self.setAudioButtonPlay();
    });
    audio.addEventListener('canplaythrough', function () {
      console.log('can play through')
      self.root.querySelector('#total-time').innerText = self.formatTime(audio.duration);
    });
    audio.addEventListener('timeupdate', function(e) {
      const percentElapsed = (audio.currentTime / audio.duration) * 100;
      const visualElapsed = 100 - percentElapsed;
      movingTimer.style.right = `${visualElapsed}%`;
      self.root.querySelector('#elapsed').innerText = self.formatTime(audio.currentTime);
    });
    audio.appendChild(source);
    container.append(this.createAudioCredit(currentCard));
    fullTimer.appendChild(movingTimer);
    container.appendChild(fullTimer);
    container.appendChild(audio);
    container.appendChild(this.createAudioDurationText());
    this.tryAutoPlay();
    return container;
  }

  tryAutoPlay() {
    const audio = this.player;
    const promise = audio.play();
    promise.then(e => {
      // Autoplay started!
      this.setAudioButtonPause();
    }).catch(err => {
      // Autoplay not allowed!
      audio.load();
      this.setAudioButtonPlay();
    });
  }

  createAudioButton() {
    const buttonContainer = document.createElement('div');
    const buttonPlay = document.createElement('button');
    const buttonPause = document.createElement('button');
    const buttonImagePlay = document.createElement('img');
    const buttonImagePause = document.createElement('img');
    
    buttonContainer.id = 'audio-button';
    buttonImagePlay.src = playButtonImgSrc;
    buttonImagePlay.classList.add('button-image');
    buttonPlay.id = 'audio-play';
    buttonPlay.classList.add('active');

    buttonImagePause.src = pauseButtonImgSrc;
    buttonImagePause.classList.add('button-image');
    buttonPause.classList.add('inactive');
    buttonPause.id = 'audio-pause';

    buttonPlay.append(buttonImagePlay);
    buttonPause.append(buttonImagePause);
    buttonContainer.append(buttonPlay);
    buttonContainer.append(buttonPause);
    return buttonContainer;
  }

  setAudioButtonPlay() {
    const self = this;
    const audioButton = this.root.querySelector('#audio-button');
    const clone = this.createAudioButton()
    const play = clone.querySelector('#audio-play');
    const pause = clone.querySelector('#audio-pause');
    
    play.classList.add('active');
    play.classList.remove('inactive');
    pause.classList.add('inactive');
    pause.classList.remove('active');
    
    clone.addEventListener('click', function(e) {
      self.playAudio(self)
      self.setAudioButtonPause();
    }, false);
    clone.addEventListener('touchstart', function(e) {
      self.playAudio(self);
      self.setAudioButtonPause();
    }, false);

    audioButton.replaceWith(clone);
  }

  setAudioButtonPause() {
    const self = this;
    const audioButton = this.root.querySelector('#audio-button');
    const clone = this.createAudioButton();
    const play = clone.querySelector('#audio-play');
    const pause = clone.querySelector('#audio-pause');
    
    play.classList.add('inactive');
    play.classList.remove('active');
    pause.classList.add('active');
    pause.classList.remove('inactive');
    
    clone.addEventListener('click', function(e) {
      e.preventDefault();
      self.pauseAudio(self)
      self.setAudioButtonPlay();
    }, false);
    clone.addEventListener('touchstart', function(e) {
      e.preventDefault();
      self.pauseAudio(self);
      self.setAudioButtonPlay();
    }, false);

    audioButton.replaceWith(clone);
  }

  playAudio(self) {
    self.player.play();
  }

  pauseAudio(self) {
    self.player.pause();
  }

  createCloseButton() {
    const self = this;
    const closeButtonContainer = document.createElement('div');
    const close = document.createElement('img');

    function closeModal(e) {
      self.dispatchEvent(new CustomEvent('close-card-modal'));
    }

    function touchCloseModal(e) {
      if (e.touches.length >= 2 ) {
        selectAndCloseModal(e);
      }
    }

    close.src = 'https://static.wixstatic.com/media/bb0dab_f1b78f85d6b44601acf5ff3fa9eff36f~mv2.png';
    closeButtonContainer.id = 'close-button-container';
    close.id = 'close-button';
    closeButtonContainer.append(close);
    closeButtonContainer.addEventListener('click', closeModal);
    closeButtonContainer.addEventListener('touchstart', touchCloseModal);
    return closeButtonContainer
  }

  createFixedContainer(currentCard) {
    const container = document.createElement('div');
    const top = document.createElement('div');
    const bottom = document.createElement('div');
    container.id = 'fixed-container';
    bottom.id = 'bottom-fixed';
    bottom.appendChild(this.createCloseButton());
    top.id = 'top-fixed';
    top.appendChild(this.createAudioButton());
    top.appendChild(this.createAudio(currentCard));
    container.appendChild(bottom);
    container.appendChild(top);
    return container;
  }

  createStyle() {
    const vp = this.getViewportAttribute();
    console.log('vp: ', vp);
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        app-card-modal {
          background-color: #C8D9E3;
          display: flex;
          height: 100%;
          width: 100%;
          justify-content: center;
        }
        #card-modal-wrapper {
          width: 100%;
        }
        #card-modal-container {
          display: flex;
          flex-direction: column;
          padding:${vp === 'mobile' ?  '10px 20px' : ' 10px 30px'};
        }
        #card-image {
          width: 100%;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        #image-credit {
          background-color: #899FAE;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          font-family: "Times New Roman", Times, serif;
          font-weight: bold;
          padding: 5px;
          font-size: 10px;
        }
        #card-image-container {
          border: 1px solid #000;
          border-radius: 8px;
        }
        #page-number-topper {
          font-style: italic;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          font-size: 14px;
          margin-bottom: 5px;
          font-weight: bold;
        }
        #description, #card-modal-wrapper h2, #instructions, #page-number-topper {
          font-family: "Times New Roman", Times, serif;
        }
        #description, #instructions {
          font-size: ${vp === 'mobile' ? '15px': '18px'};
          margin-bottom: 20px;
        }
        #card-modal-wrapper h2 {
          font-size: 25px;
          margin: 20px 0px 10px 0px;
        }
        #audio-button {
          position: relative;
        }
        #close-button-container {
          display: flex;
          justify-content: center;
          padding: 10px 0px;
        }
        #close-button, .button-image {
          height: 35px;
          width: 35px;
        }
        #fixed-container {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
        }
        .active {
          display: block;
        }
        .inactive {
          display: none;
        }
        #top-fixed {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 5px 20px;
          border-bottom: 2px solid #374955;
          border-top: 2px solid #374955;
          background-color: #899FAE;
        }
        #bottom-fixed {
          background-color: #C8D9E3;
        }
        #audio-container {
          width: 100%;
          padding: 0px 20px;
        }
        #full-timer {
          width: 100%;
          height: 5px;
          position: relative;
          background-color: #fff;
        }
        #moving-timer {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          background-color: #EE6823;
        }
        #full-timer, #moving-timer {
          border-radius: 5px;
        }
        #elapsed-container {
          display: flex;
          justify-content: space-between;
          margin-top: 2px;
        }
        #credit {
          font-family: "Times New Roman", Times, serif;
          font-weight: bold;
          margin-bottom: 2px;
          font-size: 10px;
        }
      `;
    return styleElement;
  };

  render() {
    // this or to a default value is stringified because the attribute value is stringified JSON
    const cardAttribute = this.getAttribute('card');
    const currentCard = JSON.parse(cardAttribute);

    this.root.innerHTML = `<div id="card-modal-container"></div>`

    const container = this.root.querySelector('#card-modal-container');

    container.appendChild(this.createPageNumberTopper(currentCard));
    container.appendChild(this.createCardImage(currentCard));
    container.appendChild(this.createTitle(currentCard));
    container.appendChild(this.createDescription(currentCard));
    container.appendChild(this.createInstructions());
    this.root.appendChild(this.createFixedContainer(currentCard));
  }
}
customElements.define('app-card-modal', AppCardModal);
