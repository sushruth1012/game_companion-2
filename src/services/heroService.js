import arjunaImg from '../assets/heroes/arjuna.jpg';
import karnaImg from '../assets/heroes/karna.jpg';
import shakuniImg from '../assets/heroes/shakuni.jpg';
import ghatotkachaImg from '../assets/heroes/ghatotkacha.jpg';

export const HEROES_DATABASE = [
  {
    id: 'arjuna',
    name: 'ARJUNA',
    secondaryTitle: 'GANDIVA',
    advantage: 'Target any one pawn of the opponent and move it back to their house.',
    lore: 'Arjuna was one of the five Pandava brothers and was renowned as one of the greatest archers in the Mahabharata. He received the divine bow Gandiva, becoming a formidable warrior in the Kurukshetra war.',
    image: arjunaImg,
    badgeBg: 'linear-gradient(135deg, #1B3B5C 0%, #0F253D 100%)',
    badgeBorder: '#4A85B8',
    cardBorder: '#2B5B84',
  },
  {
    id: 'karna',
    name: 'KARNA',
    secondaryTitle: 'SURYAKAVACHA',
    advantage: 'Shield your pawn by moving it to the nearest safe house.',
    lore: 'Karna was the son of Surya, the Sun God, and Kunti, born with divine armor and earrings that protected him. He rose to become the King of Anga and was renowned for his generosity and loyalty.',
    image: karnaImg,
    badgeBg: 'linear-gradient(135deg, #7A420B 0%, #4D2704 100%)',
    badgeBorder: '#D9822B',
    cardBorder: '#B86518',
  },
  {
    id: 'shakuni',
    name: 'SHAKUNI',
    secondaryTitle: 'DYUTA MAYA',
    advantage: 'Can choose any result for his dice roll.',
    lore: 'Shakuni was the Prince of Gandhara and the maternal uncle of the Kauravas, skilled at dice and strategy.',
    image: shakuniImg,
    badgeBg: 'linear-gradient(135deg, #4A2766 0%, #2A123D 100%)',
    badgeBorder: '#8E57BA',
    cardBorder: '#5C377A',
  },
  {
    id: 'ghatotkacha',
    name: 'GHATOTKACHA',
    secondaryTitle: 'MAYA SHAKTI',
    advantage: 'Move one’s pawn to any space on the board.',
    lore: 'Ghatotkacha was the son of Bhima and the Rakshasi Hidimbi, inheriting extraordinary strength and mystical abilities.',
    image: ghatotkachaImg,
    badgeBg: 'linear-gradient(135deg, #1F472B 0%, #0D2615 100%)',
    badgeBorder: '#4FA868',
    cardBorder: '#2F663D',
  },
];

/**
 * Randomly assign heroes to players based on playerCount (2, 3, or 4)
 */
export const assignRandomHeroes = (players = []) => {
  // Fisher-Yates shuffle a copy of heroes
  const shuffled = [...HEROES_DATABASE].sort(() => 0.5 - Math.random());
  
  return players.map((player, index) => {
    const hero = shuffled[index % shuffled.length];
    return {
      ...player,
      hero,
      heroName: hero.name,
      heroSecondaryTitle: hero.secondaryTitle,
      heroAdvantage: hero.advantage,
    };
  });
};
