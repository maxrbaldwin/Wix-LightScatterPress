// const createNavigation = () => {
//   const navigationContainer = document.createElement('div');
//   navigationContainer.id = 'alt-navigation';

//   navigationContainer.innerHTML = '<div id="leftNavItem" class="nav-item"><p>Previous</p></div><div id="middleNavItem" class="nav-item"><p>Random</p></div><div id="rightNavItem" class="nav-item"><p>Open</p></div>';

//   return navigationContainer;
// }

import cards from 'public/cards';

class AppNavigation extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return [];
  }

//   getCardAttribute() {
//     const defaultCard = 'card1';
//     return this.getAttribute('card') || defaultCard;
//   }

  connectedCallback() {
    // base
    const wrapper = this.createWrapper();
    wrapper.appendChild(this.createContainer())
    // wrapper.appendChild(createNavigation());

    this.appendChild(this.createStyle());
    this.appendChild(wrapper);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('change: ', name, oldValue, newValue);
  }

  createWrapper () {
      const wrapper = document.createElement('div')
      wrapper.id = 'navigation-wrapper';
      return wrapper;
  }

  createContainer() {
      const container = document.createElement('div');
      container.id = 'navigation-container';

      return container;
  }

  createStyle () {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        app-navigation {
            background-color: #ff0000;
            display: flex;
            height: 100%;
            height: -moz-available;
            height: -webkit-fill-available;
            width: 100%;
            justify-content: center;
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

customElements.define('app-navigation', AppNavigation);
