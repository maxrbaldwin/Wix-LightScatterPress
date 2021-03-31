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
      const pageNumberContainer = document.createElement('div');
      const pageNumber = document.createElement('p');
      
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

      pageNumber.innerText = `p.${card.pageNumber}`;
      pageNumberContainer.appendChild(pageNumber);
      row.appendChild(pageNumberContainer);
      row.classList.add('directory-row');
      row.style.top = `${40 * pos}px`;
      row.style.zIndex = `${pos}`;
      row.style.backgroundImage = `url(${card.front})`;
      row.addEventListener('click', selectAndCloseModal);
      row.addEventListener('touchstart', touchCloseModal);
      row.setAttribute('aria-label', card.altText);
      return row;
  }

  createTitle() {
    const title = document.createElement('p');
    title.innerText = 'Draw a card';
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

    close.src = 'https://static.wixstatic.com/media/bb0dab_f1b78f85d6b44601acf5ff3fa9eff36f~mv2.png';
    closeButtonContainer.id = 'close-button';
    closeButtonContainer.append(close);
    closeButtonContainer.addEventListener('click', closeModal);
    closeButtonContainer.addEventListener('touchstart', touchCloseModal);
    return closeButtonContainer
  }

  createStyle() {
    const vp = this.getAttribute('viewport');
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
        #card-container {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
        }
        .directory-row {
          position: absolute;
          font-size: 15px;
          background-position: center;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          border-radius: 8px;
          display: flex;
          flex-direction: row;
          padding: 10px 10px;
          font-family: "Times New Roman", Times, serif;
          justify-content: flex-end;
          height: ${vp === 'mobile' ? '300px' : '400px'};
          width: ${vp === 'mobile' ? '250px' : '350px'};
          border: 1px solid #000;
        }
        .directory-row p {
          font-style: italic;
          text-shadow: 1px 1px 0 #fff;
          font-size: 16px;
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
          z-index: 16;
        }
        #close-button img {
          height: 40px;
          width: 40px;
        }
      `;
    return styleElement;
  };

  render() {
    this.root.innerHTML = `<div aria-modal="true" id="directory-modal-container"><div id="card-container"></div></div>`;

    const container = this.root.querySelector('#directory-modal-container');
    const cardContainer = this.root.querySelector('#card-container');
    container.prepend(this.createTitle());
    container.append(this.createCloseButton());
    cardData.forEach((card, i) => {
        cardContainer.append(this.createDirectoryRow(card, i));
    })
  }
}
customElements.define('app-directory-modal', AppDirectoryModal);
