class AppCardModal extends HTMLElement {
  constructor() {
    super();
    this.root = document.createElement('div');
  }

  connectedCallback() {
    this.root.id = 'card-modal-wrapper';
    this.append(this.root);
    this.append(this.createStyle());
    this.render();
  }

  createAudio(card) {
    const audio = document.createElement('audio');
    const source = document.createElement('source');
    audio.autoplay = true;
    audio.controls = true;
    source.src = card.audio;
    source.type = 'audio/wav';
    audio.appendChild(source);
    return audio;
  }

  createStyle() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        app-card-modal {
            background-color: #E9E9E9;
            display: flex;
            height: 100%;
            height: -moz-available;
            height: -webkit-fill-available;
            width: 100%;
            justify-content: center;
        }
        #card-modal-wrapper {
          width: 100%;
          padding: 20px;
        }
      `;
    return styleElement;
  };

  render() {
    // this or to a default value is stringified because the attribute value is stringified JSON
    const cardAttribute = this.getAttribute('card');
    const currentCard = JSON.parse(cardAttribute);

    this.root.innerHTML = `
      <div id="card-modal-container">
        <p>${currentCard.title}</p>
        <p>${currentCard.desc}</p>
      </div>
    `
    if (currentCard.audio) {
      const audio = this.createAudio(currentCard);
      this.root.appendChild(audio);
    }
  }
}
customElements.define('app-card-modal', AppCardModal);
