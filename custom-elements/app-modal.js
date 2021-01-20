import cards from 'public/cards';

const createWrapper = () => {
    const wrapper = document.createElement('div')
    wrapper.id = 'modal-wrapper';
    return wrapper;
}

const createContainer = (cardParameter) => {
    const container = document.createElement('div');
    container.id = 'modal-container';

    return container;
}

const createStyle = () => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
      app-modal {
          background-color: #0000ff;
          display: flex;
          height: 100%;
          height: -moz-available;
          height: -webkit-fill-available;
          width: 100%;
          justify-content: center;
      }
    `;
  return styleElement;
};

class AppModal extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return [];
}

  connectedCallback() {
    const cardAttribute = this.getAttribute('card');
    const currentCard = cards[cardAttribute];
    // base
    const wrapper = createWrapper();
    wrapper.appendChild(createContainer(currentCard))

    this.appendChild(createStyle());
    this.appendChild(wrapper);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('change: ', name, oldValue, newValue);
  }

  render() {
    console.log('render: ', this.card);
  }
}
customElements.define('app-modal', AppModal);
