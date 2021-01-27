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

  createStyle() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        app-card-modal {
            background-color: #0000ff;
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
  }
}
customElements.define('app-card-modal', AppCardModal);
