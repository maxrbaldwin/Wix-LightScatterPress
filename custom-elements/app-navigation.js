import cards from 'public/cards';

class AppNavigation extends HTMLElement {
  constructor() {
    super();
    this.root = document.createElement('div');
  }

  connectedCallback() {
    this.root.id = 'navigation-wrapper';
    this.appendChild(this.root);
    this.appendChild(this.createStyle());
    this.render();
  }

  createWrapper () {
    const wrapper = document.createElement('div')
    wrapper.id = 'navigation-wrapper';
    return wrapper;
  }

  createContainer() {
    const container = document.createElement('div');
    container.id = 'navigation-container';
    const self = this;

    function createButton(text, id, clickEvent) {
      const button = document.createElement('div')
      const buttonText = document.createElement('p');
      
      buttonText.innerText = text;
      button.appendChild(buttonText);
      button.classList.add('nav-item');
      button.id = id;

      function buttonClick(e) {
        e.preventDefault();
        self.dispatchEvent(new CustomEvent(clickEvent));
      }

      button.addEventListener('click', buttonClick);
      
      return button;
    }

    const leftButton = createButton('Previous', 'leftNavItem', 'previous-card');
    const centerButton = createButton('Next', 'middleNavItem', 'next-card');
    const rightButton = createButton('Open', 'rightNavItem', 'open-directory-modal');

    container.appendChild(leftButton);
    container.appendChild(centerButton);
    container.appendChild(rightButton);

    return container;
  }

  createStyle () {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        app-navigation {
            background-color: #ff0000;
            display: flex;
            width: 100% !important;
            justify-content: center;
            position: fixed;
            bottom: 0;
            right: 0;
            left: 0;
        }
        #navigation-wrapper {
          width: 100%;
        }
        #navigation-container {
          display: flex;
          flex-direction: row;
          border: 1px solid #000;
          height: 100%;
        }
        .nav-item {
          flex-grow: 1;
          text-align: center;
          min-height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          height: -moz-available;
          height: -webkit-fill-available;
        }
        #middleNavItem {
          border-left: 1px solid #000;
          border-right: 1px solid #000;
        }
      `;
    return styleElement;
};

  render() {
   this.root.append(this.createContainer());
  }
}

customElements.define('app-navigation', AppNavigation);
