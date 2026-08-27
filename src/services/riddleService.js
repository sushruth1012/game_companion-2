// Standard Riddles Service - Integrated with Age-Group Spreadsheet & Member 2 Game Logic
import {
  buyRiddle as member2BuyRiddle,
  getRandomRiddle as member2GetRandomRiddle,
  submitAnswer as member2SubmitAnswer,
  validateAnswer as member2ValidateAnswer,
  STARTING_MUDRAS,
  RIDDLE_COSTS,
} from '../lib/gameLogic';

export { STARTING_MUDRAS, RIDDLE_COSTS };

/**
 * Complete Riddles Database from Google Sheets organized by Age Group & Difficulty
 * Age Groups: 8-12 | 13-16 | 17+
 * Difficulties: easy | medium | hard
 */
export const spreadsheetRiddles = {
  '8-12': {
    easy: [
      {
        id: 'r_8_12_easy_1',
        title: 'Festival of Lights',
        difficulty: 'easy',
        ageGroup: '8-12',
        lore: 'A joyous occasion celebrated across the lands with glowing deepas and sweets.',
        question: 'Which festival is popularly known as the “Festival of Lights” in India?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_deepa_light', name: 'Festival Radiance', description: 'Advance any pawn by +1 bonus space' },
        options: [
          { id: 'a', text: 'Holi', isCorrect: false },
          { id: 'b', text: 'Diwali', isCorrect: true },
          { id: 'c', text: 'Pongal', isCorrect: false },
          { id: 'd', text: 'Onam', isCorrect: false },
        ],
      },
      {
        id: 'r_8_12_easy_2',
        title: 'Bounty of the Forest',
        difficulty: 'easy',
        ageGroup: '8-12',
        lore: 'The green trees and sacred plants nourish the earth and air.',
        question: 'What do plants mainly take in from the air to make their food?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_plant_nourish', name: 'Nature’s Vitality', description: 'Immune from opponent capture for 1 turn' },
        options: [
          { id: 'a', text: 'Oxygen', isCorrect: false },
          { id: 'b', text: 'Nitrogen', isCorrect: false },
          { id: 'c', text: 'Carbon dioxide', isCorrect: true },
          { id: 'd', text: 'Water vapour', isCorrect: false },
        ],
      },
      {
        id: 'r_8_12_easy_3',
        title: 'The Royal Banquet Share',
        difficulty: 'easy',
        ageGroup: '8-12',
        lore: 'The royal confectioner prepares sweet golden laddus for four young travelers.',
        question: 'You have 12 laddus and share them equally among 4 friends. How many laddus does each friend get?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_equal_share', name: 'Equal Harmony', description: 'Choose between 2 dice roll options on board' },
        options: [
          { id: 'a', text: '2', isCorrect: false },
          { id: 'b', text: '3', isCorrect: true },
          { id: 'c', text: '4', isCorrect: false },
          { id: 'd', text: '6', isCorrect: false },
        ],
      },
    ],
    medium: [
      {
        id: 'r_8_12_med_1',
        title: 'The Great Soul',
        difficulty: 'medium',
        ageGroup: '8-12',
        lore: 'A revered leader walked with truth and non-violence across the nation.',
        question: 'Who is known as the “Father of the Nation” in India?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_peace_walk', name: 'Ahimsa Shield', description: 'Shield your nearest pawn in a safe zone' },
        options: [
          { id: 'a', text: 'Jawaharlal Nehru', isCorrect: false },
          { id: 'b', text: 'Sardar Patel', isCorrect: false },
          { id: 'c', text: 'Mahatma Gandhi', isCorrect: true },
          { id: 'd', text: 'Subhas Chandra Bose', isCorrect: false },
        ],
      },
      {
        id: 'r_8_12_med_2',
        title: 'Toss of Fate',
        difficulty: 'medium',
        ageGroup: '8-12',
        lore: 'A royal coin spins through the air to determine the first move.',
        question: 'A coin has two sides: heads and tails. If you toss it once, what is the chance of getting heads?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_fortune_toss', name: 'Fortune Coin', description: 'Re-roll your cowries if unsatisfied with result' },
        options: [
          { id: 'a', text: '0%', isCorrect: false },
          { id: 'b', text: '25%', isCorrect: false },
          { id: 'c', text: '50%', isCorrect: true },
          { id: 'd', text: '100%', isCorrect: false },
        ],
      },
      {
        id: 'r_8_12_med_3',
        title: 'Rhythm of Life',
        difficulty: 'medium',
        ageGroup: '8-12',
        lore: 'Deep inside the chest, a tireless engine beats with energy and life.',
        question: 'Which organ pumps blood throughout your body?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_pulse_power', name: 'Vital Heartbeat', description: 'Double movement speed for your lead pawn' },
        options: [
          { id: 'a', text: 'Brain', isCorrect: false },
          { id: 'b', text: 'Heart', isCorrect: true },
          { id: 'c', text: 'Lungs', isCorrect: false },
          { id: 'd', text: 'Stomach', isCorrect: false },
        ],
      },
    ],
    hard: [
      {
        id: 'r_8_12_hard_1',
        title: 'Sacred Thread of Protection',
        difficulty: 'hard',
        ageGroup: '8-12',
        lore: 'An elder offers a sacred blessing before the warrior sets forth on the quest.',
        question: 'I am worn on the wrist, but I am not a watch. In many Indian traditions, I am tied for blessings and protection. What am I?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_kalava_shield', name: 'Sacred Raksha', description: 'Teleport one pawn directly to the nearest safe Katte' },
        options: [
          { id: 'a', text: 'Kalava', isCorrect: true },
          { id: 'b', text: 'Turban', isCorrect: false },
          { id: 'c', text: 'Anklet', isCorrect: false },
          { id: 'd', text: 'Bindi', isCorrect: false },
        ],
      },
      {
        id: 'r_8_12_hard_2',
        title: 'The Infallible Bow',
        difficulty: 'hard',
        ageGroup: '8-12',
        lore: 'A divine weapon bestowed upon the greatest archer of the epic era.',
        question: 'I have many strings, but I am not a rope. Arjuna was famous for using me in the Mahabharata. What am I?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_gandiva_aim', name: 'Gandiva Strike', description: 'Target any opponent pawn and return it to their house' },
        options: [
          { id: 'a', text: 'Veena', isCorrect: false },
          { id: 'b', text: 'Gandiva', isCorrect: true },
          { id: 'c', text: 'Flute', isCorrect: false },
          { id: 'd', text: 'Tabla', isCorrect: false },
        ],
      },
      {
        id: 'r_8_12_hard_3',
        title: 'The Traditional Seat',
        difficulty: 'hard',
        ageGroup: '8-12',
        lore: 'In the heritage courtyard, dining and gatherings carry age-old customs.',
        question: 'I have four legs, but I am not an animal. In a traditional Indian kitchen, I may help you sit while eating. What am I?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_patla_rest', name: 'Courtyard Solace', description: 'Pawn cannot be pushed back on this round' },
        options: [
          { id: 'a', text: 'Patla', isCorrect: true },
          { id: 'b', text: 'Dholak', isCorrect: false },
          { id: 'c', text: 'Kalash', isCorrect: false },
          { id: 'd', text: 'Diya', isCorrect: false },
        ],
      },
    ],
  },
  '13-16': {
    easy: [
      {
        id: 'r_13_16_easy_1',
        title: 'Dance of the Gods',
        difficulty: 'easy',
        ageGroup: '13-16',
        lore: 'Elaborate painted face masks, dramatic gestures, and beating drums echo through Kerala.',
        question: 'Which Indian classical dance originated in Kerala?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_kathakali_grace', name: 'Kathakali Step', description: 'Move +1 additional space forward' },
        options: [
          { id: 'a', text: 'Kathak', isCorrect: false },
          { id: 'b', text: 'Bharatanatyam', isCorrect: false },
          { id: 'c', text: 'Kathakali', isCorrect: true },
          { id: 'd', text: 'Odissi', isCorrect: false },
        ],
      },
      {
        id: 'r_13_16_easy_2',
        title: 'Breath of the Elements',
        difficulty: 'easy',
        ageGroup: '13-16',
        lore: 'The air carries life across the vast mountains and lush rivers of the subcontinent.',
        question: 'Which gas do humans need to breathe in order to survive?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_prana_vitality', name: 'Prana Surge', description: 'Roll two consecutive turns' },
        options: [
          { id: 'a', text: 'Oxygen', isCorrect: true },
          { id: 'b', text: 'Carbon dioxide', isCorrect: false },
          { id: 'c', text: 'Hydrogen', isCorrect: false },
          { id: 'd', text: 'Helium', isCorrect: false },
        ],
      },
      {
        id: 'r_13_16_easy_3',
        title: 'The Merchant’s Calculation',
        difficulty: 'easy',
        ageGroup: '13-16',
        lore: 'A Silk Route merchant calculates tax for a trade caravan of 200 gold coins.',
        question: 'What is 15% of 200?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_mercantile_math', name: 'Merchant Precision', description: 'Choose your desired roll for the next move' },
        options: [
          { id: 'a', text: '15', isCorrect: false },
          { id: 'b', text: '20', isCorrect: false },
          { id: 'c', text: '30', isCorrect: true },
          { id: 'd', text: '40', isCorrect: false },
        ],
      },
    ],
    medium: [
      {
        id: 'r_13_16_med_1',
        title: 'Architect of the Empire',
        difficulty: 'medium',
        ageGroup: '13-16',
        lore: 'Guided by Chanakya, a young warrior unified ancient kingdoms into a grand empire.',
        question: 'Who was the first emperor of the Maurya Empire?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_maurya_might', name: 'Imperial Command', description: 'Move any pawn directly to the inner corridor' },
        options: [
          { id: 'a', text: 'Ashoka', isCorrect: false },
          { id: 'b', text: 'Chandragupta Maurya', isCorrect: true },
          { id: 'c', text: 'Bindusara', isCorrect: false },
          { id: 'd', text: 'Harshavardhana', isCorrect: false },
        ],
      },
      {
        id: 'r_13_16_med_2',
        title: 'The Pouch of Fate',
        difficulty: 'medium',
        ageGroup: '13-16',
        lore: 'A mysterious pouch holds colorful gems. Probability dictates the traveler’s destiny.',
        question: 'A bag contains 3 red balls and 2 blue balls. If you pick one ball without looking, what is the probability of getting a blue ball?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_probability_insight', name: 'Strategic Vision', description: 'Look at the next 2 challenge cards' },
        options: [
          { id: 'a', text: '1/5', isCorrect: false },
          { id: 'b', text: '2/5', isCorrect: true },
          { id: 'c', text: '3/5', isCorrect: false },
          { id: 'd', text: '1/2', isCorrect: false },
        ],
      },
      {
        id: 'r_13_16_med_3',
        title: 'Cosmic Tether',
        difficulty: 'medium',
        ageGroup: '13-16',
        lore: 'The night sky reveals celestial bodies revolving in perfect, eternal harmony.',
        question: 'What force keeps the Moon moving around the Earth?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_cosmic_gravity', name: 'Gravitational Pull', description: 'Pull an opponent’s pawn 2 squares back' },
        options: [
          { id: 'a', text: 'Friction', isCorrect: false },
          { id: 'b', text: 'Magnetism', isCorrect: false },
          { id: 'c', text: 'Gravity', isCorrect: true },
          { id: 'd', text: 'Electricity', isCorrect: false },
        ],
      },
    ],
    hard: [
      {
        id: 'r_13_16_hard_1',
        title: 'The Eternal Flame',
        difficulty: 'hard',
        ageGroup: '13-16',
        lore: 'A brass lamp shines in the sanctum, dispelling darkness and ignorance.',
        question: 'I am a lamp that is often lit during prayers and festivals. My small flame is said to represent light overcoming darkness. What am I?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_diya_blaze', name: 'Deepa Jyoti', description: 'Shield all your pawns from attacks for 1 round' },
        options: [
          { id: 'a', text: 'Diya', isCorrect: true },
          { id: 'b', text: 'Kalash', isCorrect: false },
          { id: 'c', text: 'Chakra', isCorrect: false },
          { id: 'd', text: 'Conch', isCorrect: false },
        ],
      },
      {
        id: 'r_13_16_hard_2',
        title: 'The Royal Horn of Ceremony',
        difficulty: 'hard',
        ageGroup: '13-16',
        lore: 'A wind instrument resonated across temple corridors and royal courts during celebrations.',
        question: 'I am a curved instrument with a deep, powerful sound. In Indian royal processions and ceremonies, I have announced grand occasions. What am I?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_nadaswaram_anthem', name: 'Mangala Dhwani', description: 'Advance pawn by +3 extra steps' },
        options: [
          { id: 'a', text: 'Shehnai', isCorrect: false },
          { id: 'b', text: 'Nadaswaram', isCorrect: true },
          { id: 'c', text: 'Nagara', isCorrect: false },
          { id: 'd', text: 'Sitar', isCorrect: false },
        ],
      },
      {
        id: 'r_13_16_hard_3',
        title: 'Wheel of Righteousness',
        difficulty: 'hard',
        ageGroup: '13-16',
        lore: 'Emblazoned in navy blue on white silk, 24 spokes spin the wheel of eternal virtue.',
        question: 'I am a wheel with many spokes, found on India\'s national flag. I remind us to keep moving forward. What am I?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_ashoka_wheel', name: 'Dharma Velocity', description: 'Advance any pawn directly into the winning Katte' },
        options: [
          { id: 'a', text: 'Sudarshan Chakra', isCorrect: false },
          { id: 'b', text: 'Ashoka Chakra', isCorrect: true },
          { id: 'c', text: 'Dharma Chakra', isCorrect: false },
          { id: 'd', text: 'Kalachakra', isCorrect: false },
        ],
      },
    ],
  },
  '17+': {
    easy: [
      {
        id: 'r_17_easy_1',
        title: 'Seat of Ancient Wisdom',
        difficulty: 'easy',
        ageGroup: '17+',
        lore: 'Scholars from across the world traveled over mountains to study in this residential university.',
        question: 'Which ancient Indian university was located in present-day Bihar?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_nalanda_wisdom', name: 'Nalanda Insight', description: 'Gain +800 Mudras and move +1 step' },
        options: [
          { id: 'a', text: 'Takshashila', isCorrect: false },
          { id: 'b', text: 'Nalanda', isCorrect: true },
          { id: 'c', text: 'Vikramaditya', isCorrect: false },
          { id: 'd', text: 'Ujjain', isCorrect: false },
        ],
      },
      {
        id: 'r_17_easy_2',
        title: 'The Core of Being',
        difficulty: 'easy',
        ageGroup: '17+',
        lore: 'At the microscopic center of life lies the blueprint of heritage and heredity.',
        question: 'Which part of the cell contains most of its genetic material?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_nucleus_core', name: 'Cellular Resilience', description: 'Pawn cannot be displaced on normal tiles for 1 round' },
        options: [
          { id: 'a', text: 'Ribosome', isCorrect: false },
          { id: 'b', text: 'Nucleus', isCorrect: true },
          { id: 'c', text: 'Cell wall', isCorrect: false },
          { id: 'd', text: 'Cytoplasm', isCorrect: false },
        ],
      },
      {
        id: 'r_17_easy_3',
        title: 'Growth of the Treasury',
        difficulty: 'easy',
        ageGroup: '17+',
        lore: 'A treasury accountant calculates the original investment after a twenty percent harvest surplus.',
        question: 'If a number is increased by 20% and becomes 120, what was the original number?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_treasury_surplus', name: 'Surplus Dividend', description: 'Add +500 bonus Mudras' },
        options: [
          { id: 'a', text: '80', isCorrect: false },
          { id: 'b', text: '90', isCorrect: false },
          { id: 'c', text: '100', isCorrect: true },
          { id: 'd', text: '110', isCorrect: false },
        ],
      },
    ],
    medium: [
      {
        id: 'r_17_med_1',
        title: 'Master of the Shunya',
        difficulty: 'medium',
        ageGroup: '17+',
        lore: 'Ancient Indian treatises formulated mathematical rules for operations involving zero and negatives.',
        question: 'The concept of “zero” as a number was significantly developed in ancient India. Which mathematician is strongly associated with rules for calculating with zero?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_shunya_mastery', name: 'Zero Calculation', description: 'Zero out an opponent’s roll on their next turn' },
        options: [
          { id: 'a', text: 'Aryabhata', isCorrect: false },
          { id: 'b', text: 'Brahmagupta', isCorrect: true },
          { id: 'c', text: 'Bhaskara I', isCorrect: false },
          { id: 'd', text: 'Varahamihira', isCorrect: false },
        ],
      },
      {
        id: 'r_17_med_2',
        title: 'Duality of Chance',
        difficulty: 'medium',
        ageGroup: '17+',
        lore: 'Two royal coins clink on the stone board. Probabilities govern the strategic crossroads.',
        question: 'You toss two fair coins at the same time. What is the probability of getting exactly one head?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_dual_chance', name: 'Dual Probability', description: 'Split your dice move between two pawns' },
        options: [
          { id: 'a', text: '1/4', isCorrect: false },
          { id: 'b', text: '1/3', isCorrect: false },
          { id: 'c', text: '1/2', isCorrect: true },
          { id: 'd', text: '3/4', isCorrect: false },
        ],
      },
      {
        id: 'r_17_med_3',
        title: 'Buoyancy of the Waters',
        difficulty: 'medium',
        ageGroup: '17+',
        lore: 'From the frozen Himalayas to sacred lakes, physical principles govern water and ice.',
        question: 'Why does ice float on water?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_buoyant_flow', name: 'Buoyant Glide', description: 'Jump over any obstacle pawn on the board' },
        options: [
          { id: 'a', text: 'Ice contains air', isCorrect: false },
          { id: 'b', text: 'Ice is less dense', isCorrect: true },
          { id: 'c', text: 'Ice is heavier', isCorrect: false },
          { id: 'd', text: 'Water pushes it upward', isCorrect: false },
        ],
      },
    ],
    hard: [
      {
        id: 'r_17_hard_1',
        title: 'The National Pillar of Pride',
        difficulty: 'hard',
        ageGroup: '17+',
        lore: 'Four Asiatic lions stand back to back atop an abacus carrying the wheel of law.',
        question: 'I stand tall with four lions, but you can see only three from one side. I became the national emblem of India. What am I?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_lion_capital', name: 'Ashoka Emblem', description: 'Move any pawn directly to the home lane' },
        options: [
          { id: 'a', text: 'Lion Capital of Ashoka', isCorrect: true },
          { id: 'b', text: 'Gateway of India', isCorrect: false },
          { id: 'c', text: 'Konark Wheel', isCorrect: false },
          { id: 'd', text: 'Sanchi Stupa', isCorrect: false },
        ],
      },
      {
        id: 'r_17_hard_2',
        title: 'The Queen’s Stepwell',
        difficulty: 'hard',
        ageGroup: '17+',
        lore: 'Sculptured pillars descend deep into the earth in an inverted subterranean temple of water.',
        question: 'I am an ancient Indian stepwell, built with flights of stairs leading down to water. One of my most famous examples is in Gujarat. What am I?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_stepwell_depth', name: 'Rani ki Vav Sanctuary', description: 'Move your pawn to the nearest safe Katte square' },
        options: [
          { id: 'a', text: 'Charminar', isCorrect: false },
          { id: 'b', text: 'Gol Gumbaz', isCorrect: false },
          { id: 'c', text: 'Rani ki Vav', isCorrect: true },
          { id: 'd', text: 'Brihadeeswara Temple', isCorrect: false },
        ],
      },
      {
        id: 'r_17_hard_3',
        title: 'The Ancient Cross Game',
        difficulty: 'hard',
        ageGroup: '17+',
        lore: 'Cowrie shells clatter on cloth and wooden boards in a traditional 5x5 race of strategy and Katte sanctuaries.',
        question: 'I am a traditional Indian board game where players move pieces using cowrie shells. I am considered an ancestor of games like Ludo. What am I?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_choukabara_legend', name: 'Grandmaster Katte', description: 'Teleport any friendly pawn directly into the winning square' },
        options: [
          { id: 'a', text: 'Pachisi', isCorrect: false },
          { id: 'b', text: 'Chaturanga', isCorrect: false },
          { id: 'c', text: 'Moksha Patam', isCorrect: false },
          { id: 'd', text: 'Chouka Bara', isCorrect: true },
        ],
      },
    ],
  },
};

/**
 * Normalizes player age input to one of the 3 supported age group keys
 */
export const normalizeAgeGroup = (playerAge) => {
  if (!playerAge) return '8-12';
  
  if (typeof playerAge === 'string') {
    const clean = playerAge.trim().replace(/\s+/g, '');
    if (clean === '8-12' || clean === '5-10' || clean === '8to12') return '8-12';
    if (clean === '13-16' || clean === '10-15' || clean === '13to16') return '13-16';
    if (clean === '17+' || clean === '15+' || clean === '17plus' || clean === '18+') return '17+';
  }

  if (typeof playerAge === 'number') {
    if (playerAge <= 12) return '8-12';
    if (playerAge <= 16) return '13-16';
    return '17+';
  }

  return '8-12';
};

/**
 * Get random riddle filtered strictly by the player's Age Group and Difficulty tier
 */
export const getRandomRiddle = (themeKey = 'rajya', difficulty = 'medium', playerAge = '8-12') => {
  const ageGroupKey = normalizeAgeGroup(playerAge);
  const ageGroupRiddles = spreadsheetRiddles[ageGroupKey] || spreadsheetRiddles['8-12'];
  const pool = ageGroupRiddles[difficulty] || ageGroupRiddles['medium'] || [];

  if (pool.length === 0) {
    return spreadsheetRiddles['8-12']['medium'][0];
  }

  const randomIdx = Math.floor(Math.random() * pool.length);
  return pool[randomIdx];
};

/**
 * Buy a riddle via Member 2 Game Logic
 */
export const buyRiddle = async (player, riddle) => {
  return member2BuyRiddle(player, riddle);
};

/**
 * Submit answer via Member 2 Game Logic
 */
export const submitAnswer = async (player, isCorrect, advantage) => {
  return member2SubmitAnswer(player, isCorrect, advantage);
};

/**
 * Validate answer
 */
export const validateAnswer = (isCorrect) => {
  return member2ValidateAnswer(isCorrect);
};
