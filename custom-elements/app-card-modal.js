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

  createCardImage(card) {
    const image = document.createElement('img');
    image.src = card.front || card.backColor;
    return image;
  }

  createTitle(currentCard) {
    const title = document.createElement('p');
    title.innerText = currentCard.title;
    return title;
  }

  createDescription(currentCard) {
    const desc = document.createElement('p');
    desc.innerText = currentCard.desc;
    return desc;
  }

  createAudio(src) {
    const self = this;
    const audio = this.player;
    const source = document.createElement('source');
    source.src = src;
    source.type = 'audio/wav';
    audio.id = 'audio-player';
    audio.addEventListener('ended', function() {
      audio.currentTime = 0;
      self.setAudioButtonPlay();
    });
    audio.appendChild(source);
    return audio;
  }

  tryAutoPlay() {
    const audio = this.player;
    const promise = audio.play();
    promise.then(e => {
      // Autoplay started!
      this.setAudioButtonPause();
    }).catch(err => {
      // Autoplay not allowed!
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
      e.preventDefault();
      self.playAudio(self)
      self.setAudioButtonPause();
    }, false);
    clone.addEventListener('touchstart', function(e) {
      e.preventDefault();
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
    closeButtonContainer.id = 'close-button';
    closeButtonContainer.append(close);
    closeButtonContainer.addEventListener('click', closeModal);
    closeButtonContainer.addEventListener('touchstart', touchCloseModal);
    return closeButtonContainer
  }

  createFixedContainer(currentCard) {
    const container = document.createElement('div');
    const spacer = document.createElement('div');
    container.id = 'fixed-container';
    spacer.id = 'spacer';
    container.appendChild(spacer);
    container.appendChild(this.createCloseButton());
    if (currentCard.audio) {
      container.appendChild(this.createAudio(currentCard.audio));
      this.tryAutoPlay();
      container.appendChild(this.createAudioButton());
    }

    return container;
  }

  createStyle() {
    const vp = this.getViewportAttribute();
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        app-card-modal {
          background-color: #C8D9E3;
          display: flex;
          height: 100%;
          height: -moz-available;
          height: -webkit-fill-available;
          width: 100%;
          justify-content: center;
        }
        #card-modal-wrapper {
          width: 100%;
        }
        #card-modal-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        #card-modal-container img {
          width: 100%;
        }
        #audio-button {
          flex-basis: 33%;
          position: relative;
        }
        #close-button {
          ${vp === 'mobile' || vp === 'tablet' ? `
            flex-basis: 33%;
          ` : ``}
          display: flex;
          justify-content: center;
        }
        #close-button img {
          height: 40px;
          width: 40px;
        }
        #fixed-container {
          position: fixed;
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          bottom: ${vp === 'mobile' || vp === 'tablet' ? '20px' : '40px'};
        }
        #spacer {
          flex-basis: 33%;
        }
        .active {
          display: block;
        }
        .inactive {
          display: none;
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

    container.appendChild(this.createCardImage(currentCard));
    container.appendChild(this.createTitle(currentCard));
    container.appendChild(this.createDescription(currentCard));
    container.appendChild(this.createFixedContainer(currentCard));
  }
}
customElements.define('app-card-modal', AppCardModal);
