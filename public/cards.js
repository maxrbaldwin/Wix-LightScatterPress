const beeCard = 'https://res.cloudinary.com/maxrbaldwin-com/image/upload/v1611869272/Wix-LightScatterPress/beecard.png'
const blackCard = 'https://res.cloudinary.com/maxrbaldwin-com/image/upload/v1611865301/Wix-LightScatterPress/cardback.png'
const greenCard = 'https://res.cloudinary.com/maxrbaldwin-com/image/upload/v1611869272/Wix-LightScatterPress/greencard.png'
const blueCard = 'https://res.cloudinary.com/maxrbaldwin-com/image/upload/v1611869272/Wix-LightScatterPress/bluecard.png'

export const data = [
  {
    id: '10001',
    title: 'card 1',
    desc: "Here is card one",
    image: '',
    backColor: blackCard,
  },
  {
    id: '10002',
    title: 'card 2',
    desc: "Here is card two",
    image: '',
    backColor: beeCard,
  },
  {
    id: '10003',
    title: 'card 3',
    desc: "Here is card three",
    image: '',
    backColor: greenCard,
  },
  {
    id: '10004',
    title: 'card 4',
    desc: "Here is card four",
    image: '',
    backColor: blackCard,
  },
  {
    id: '10005',
    title: 'card 5',
    desc: "Here is card five",
    image: '',
    backColor: 'https://res.cloudinary.com/maxrbaldwin-com/image/upload/v1613072069/Wix-LightScatterPress/back-of-card-draft.jpg',
    front: 'https://res.cloudinary.com/maxrbaldwin-com/image/upload/v1612988042/Wix-LightScatterPress/gaia.jpg',
    audio: 'https://res.cloudinary.com/maxrbaldwin-com/video/upload/v1612988055/Wix-LightScatterPress/Gaia_2.wav',
  },
  {
    id: '10006',
    title: 'card 6',
    desc: "Here is card six",
    image: '',
    backColor: beeCard,
  },
  {
    id: '10007',
    title: 'card 7',
    desc: "Here is card seven",
    image: '',
    backColor: greenCard,
  },
  {
    id: '10008',
    title: 'card 8',
    desc: "Here is card eight",
    image: '',
    backColor: blueCard,
  },
  {
    id: '10009',
    title: 'card 9',
    desc: "Here is card nine",
    image: '',
    backColor: blackCard,
  },
  {
    id: '10010',
    title: 'card 10',
    desc: "Here is card ten",
    image: '',
    backColor: greenCard,
  },
  {
    id: '10011',
    title: 'card 11',
    desc: "Here is card eleven",
    image: '',
    backColor: beeCard,
  },
  {
    id: '10012',
    title: 'card 12',
    desc: "Here is card twelve",
    image: '',
    backColor: greenCard,
  },
  {
    id: '10013',
    title: 'card 13',
    desc: "Here is card thirteen",
    image: '',
    backColor: blackCard,
  },
  {
    id: '10014',
    title: 'card 14',
    desc: "Here is card fourteen",
    image: '',
    backColor: greenCard,
  },
  {
    id: '10015',
    title: 'card 15',
    desc: "Here is card fifteen",
    image: '',
    backColor: blueCard,
  },
];

function makeDeck(firstCard) {
  const clone = data;
  const currentIndex = clone.findIndex(card => card.id === firstCard.toString());
  const first = clone[currentIndex];
  clone.splice(currentIndex, 1);
  clone.unshift(first);
  return clone;
}

class cards {
  constructor(firstCard) {
    this.data = makeDeck(firstCard);
    this.currentCard = firstCard.toString();
  }
  selectCard(card) {
    const clone = this.data;
    const cardIndex = clone.findIndex(item => item.id === card.id);
    clone.splice(cardIndex, 1);
    clone.unshift(card);
    this.data = clone;
    this.currentCard = card.id;
    return this.data;
  }
  previousCard() {
    const clone = this.data;
    const lastIndex = clone.length - 1;
    const currentCard = clone[0];
    const lastCard = clone[lastIndex];
    clone.splice(lastIndex, 1);
    clone.splice(0, 1);
    this.data = [lastCard, currentCard, ...clone];
    this.currentCard = lastCard.id;
    return this.data;
  }
  nextCard() {
    const clone = this.data;
    const currentCard = clone[0];
    const nextCard = clone[1];
    clone.splice(0, 2);
    this.data = [nextCard, ...clone, currentCard];
    this.currentCard = nextCard.id;
    return this.data;
  }
  getCurrentCardData() {
    return this.data.find(item => item.id === this.currentCard.toString());
  }
}

export default cards;

export const defaultCard = 10001;