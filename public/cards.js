export const data = [
  {
    id: '10001',
    title: 'card 1',
    desc: "Here is card one",
    image: '',
    backColor: '#0000ff',
  },
  {
    id: '10002',
    title: 'card 2',
    desc: "Here is card two",
    image: '',
    backColor: '#ff0000',
  },
  {
    id: '10003',
    title: 'card 3',
    desc: "Here is card three",
    image: '',
    backColor: '#0000ff',
  },
  {
    id: '10004',
    title: 'card 4',
    desc: "Here is card four",
    image: '',
    backColor: '#ff0000',
  },
  {
    id: '10005',
    title: 'card 5',
    desc: "Here is card five",
    image: '',
    backColor: '#0000ff',
  },
  {
    id: '10006',
    title: 'card 6',
    desc: "Here is card six",
    image: '',
    backColor: '#0000ff',
  },
  {
    id: '10007',
    title: 'card 7',
    desc: "Here is card seven",
    image: '',
    backColor: '#ff0000',
  },
  {
    id: '10008',
    title: 'card 8',
    desc: "Here is card eight",
    image: '',
    backColor: '#0000ff',
  },
  {
    id: '10009',
    title: 'card 9',
    desc: "Here is card nine",
    image: '',
    backColor: '#ff0000',
  },
  {
    id: '10010',
    title: 'card 10',
    desc: "Here is card ten",
    image: '',
    backColor: '#0000ff',
  },
  {
    id: '10011',
    title: 'card 11',
    desc: "Here is card eleven",
    image: '',
    backColor: '#0000ff',
  },
  {
    id: '10012',
    title: 'card 12',
    desc: "Here is card twelve",
    image: '',
    backColor: '#ff0000',
  },
  {
    id: '10013',
    title: 'card 13',
    desc: "Here is card thirteen",
    image: '',
    backColor: '#0000ff',
  },
  {
    id: '10014',
    title: 'card 14',
    desc: "Here is card fourteen",
    image: '',
    backColor: '#ff0000',
  },
  {
    id: '10015',
    title: 'card 15',
    desc: "Here is card fifteen",
    image: '',
    backColor: '#0000ff',
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