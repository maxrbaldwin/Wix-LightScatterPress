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

  getCardAttribute() {
    return JSON.parse(this.getAttribute('card'));
  }

  createContainer() {
    const container = document.createElement('div');
    container.id = 'navigation-container';
    const self = this;

    function createButton(iconKey, id, clickEvent) {
      const button = document.createElement('button')
      const icons = {
        open: '<img src="https://static.wixstatic.com/media/bb0dab_469058bc9aef4cedadbd0f7bc54f0fb0~mv2.png" class="nav-icon" />',
        shuffle: '<img src="https://static.wixstatic.com/media/bb0dab_6e59c95cda0a41a1b2f80e111e53eb99~mv2.png" class="nav-icon" />',
        bookmark: `<div id="bookmark">${self.getCardAttribute().pageNumber}</div>`,
      };

      button.innerHTML = icons[iconKey];
      button.classList.add('nav-item');
      button.id = id;

      function buttonClick(e) {
        console.log('click: ', e);
        self.dispatchEvent(new CustomEvent(clickEvent));
        e.preventDefault();
      }

      button.addEventListener('click', buttonClick, false);
      button.addEventListener('touchstart', buttonClick, false);
      
      return button;
    }

    const openButton = createButton('open', 'openNavItem', 'open-directory-modal');
    const bookmarkButton = createButton('bookmark', 'bookmarkNav', 'bookmark');
    const shuffleButton = createButton('shuffle', 'shuffle', 'shuffle');

    container.appendChild(openButton);
    container.appendChild(bookmarkButton);
    container.appendChild(shuffleButton);

    return container;
  }

  createStyle () {
    const styleElement = document.createElement('style');
    const vp = this.getAttribute('viewport') || 'mobile';
    styleElement.innerHTML = `
        app-navigation {
          display: flex;
          justify-content: center;
          ${vp === 'mobile' ? `
            width: 100% !important;
            position: fixed;
            bottom: 0;
            right: 0;
            left: 0;
            z-index: 100;
          ` : ``}
        }
        #navigation-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        #navigation-container {
          background-color: #899FAE;
          display: flex;
          flex-direction: row;
          border-top: 1px solid #899FAE;
          height: 100%;
          width: 100%;
        }
        .nav-item {
          flex-grow: 1;
          text-align: center;
          min-height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-family: "Times New Roman", Times, serif;
          font-size: 15px;
        }
        .nav-icon {
          width: 40px;
          height: 40px;
        }
        #openNavItem {
          border-right: 1px solid #899FAE;
        }
      `;
    return styleElement;
};

  render() {
   this.root.append(this.createContainer());
  }
}

customElements.define('app-navigation', AppNavigation);
