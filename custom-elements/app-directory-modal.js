import { data as cardData } from 'public/cards';

class AppDirectoryModal extends HTMLElement {
  constructor() {
    super();
    this.root = document.createElement('div');
  }

  connectedCallback() {
    this.root.id = 'directory-modal-wrapper';
    this.append(this.root);
    this.append(this.createStyle());
    this.render();
  }

  createDirectoryRow(card) {
      const self = this;
      const row = document.createElement('div');
      const title = document.createElement('p');
      
      function selectAndCloseModal(e) {
        self.dispatchEvent(new CustomEvent('close-directory-modal', {
          detail: {
            card: card,
          }
        }));
      }

      function touchCloseModal(e) {
        if (e.touches.length >= 2 ) {
          selectAndCloseModal(e);
        }
      }

      row.classList.add('directory-row');
      title.innerText = card.title;
      row.append(title);
      row.addEventListener('click', selectAndCloseModal);
      row.addEventListener('touchstart', touchCloseModal);
      return row;
  }

  createStyle() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        app-directory-modal {
            background-color: #E9E9E9;
            display: flex;
            height: 100%;
            height: -moz-available;
            height: -webkit-fill-available;
            width: 100%;
            justify-content: center;
        }
        #directory-modal-wrapper {
          width: 100%;
          padding: 20px;
        }
        .directory-row {
          width: 100%;
          min-height: 50px;
          text-align: center;
          font-size: 15px;
        }
      `;
    return styleElement;
  };

  render() {
    this.root.innerHTML = `<div id="directory-modal-container"></div>`;

    const container = this.root.querySelector('#directory-modal-container');
    cardData.forEach((card) => {
        container.append(this.createDirectoryRow(card));
    })
  }
}
customElements.define('app-directory-modal', AppDirectoryModal);
