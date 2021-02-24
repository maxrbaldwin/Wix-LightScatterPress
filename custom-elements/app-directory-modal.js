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

  createDirectoryRow(card, pos) {
      const self = this;
      const row = document.createElement('div');
      
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
      row.style.backgroundImage = `url(${card.backColor})`;
      row.addEventListener('click', selectAndCloseModal);
      row.addEventListener('touchstart', touchCloseModal);
      return row;
  }

  createTitle() {
    const title = document.createElement('p');
    title.innerText = 'Pick a card. Any card';
    title.classList.add('modal-title');
    return title;
  }

  createCloseButton() {
    const self = this;
    const closeButtonContainer = document.createElement('div');
    const close = document.createElement('img');

    function closeModal(e) {
      self.dispatchEvent(new CustomEvent('close-directory-modal'));
    }

    function touchCloseModal(e) {
      if (e.touches.length >= 2 ) {
        selectAndCloseModal(e);
      }
    }

    close.src = 'https://res.cloudinary.com/maxrbaldwin-com/image/upload/v1613752844/Wix-LightScatterPress/x.png';
    closeButtonContainer.id = 'close-button';
    closeButtonContainer.append(close);
    closeButtonContainer.addEventListener('click', closeModal);
    closeButtonContainer.addEventListener('touchstart', touchCloseModal);
    return closeButtonContainer
  }

  createStyle() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        app-directory-modal {
          background-color: #C8D9E3;
          display: flex;
          height: 100%;
          height: -moz-available;
          height: -webkit-fill-available;
          width: 100%;
          justify-content: center;
        }
        #directory-modal-wrapper {
          width: 100%;
          padding: 20px 10px;
          text-align: center;
        }
        .directory-row {
          min-height: 50px;
          font-size: 15px;
          background-position: center top;
          background-size: 100% auto;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0px 10px;
        }
        .modal-title {
          font-size: 25px;
          font-family: "Times New Roman", Times, serif;
          color: #738C9C;
          margin-bottom: 10px;
        }
        #close-button {
          position: fixed;
          bottom: 20px;
          left: 0;
          right: 0;
        }
        #close-button img {
          height: 40px;
          width: 40px;
        }
      `;
    return styleElement;
  };

  render() {
    this.root.innerHTML = `<div id="directory-modal-container"></div>`;

    const container = this.root.querySelector('#directory-modal-container');
    container.append(this.createTitle());
    container.append(this.createCloseButton());
    cardData.forEach((card, i) => {
        container.append(this.createDirectoryRow(card, i));
    })
  }
}
customElements.define('app-directory-modal', AppDirectoryModal);
