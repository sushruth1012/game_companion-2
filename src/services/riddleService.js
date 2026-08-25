// Standard Riddles Service - Fully Integrated with Member 2 Game Logic (src/lib/gameLogic.ts)
import {
  buyRiddle as member2BuyRiddle,
  getRandomRiddle as member2GetRandomRiddle,
  submitAnswer as member2SubmitAnswer,
  validateAnswer as member2ValidateAnswer,
  STARTING_MUDRAS,
  RIDDLE_COSTS,
} from '../lib/gameLogic';

export { STARTING_MUDRAS, RIDDLE_COSTS };

// Comprehensive Theme-Based Riddles by Difficulty (Easy: 500, Medium: 1000, Hard: 1500)
export const themeRiddlesDatabase = {
  rajya: {
    easy: [
      {
        id: 'rajya_easy_1',
        title: 'The Royal Envoy',
        difficulty: 'easy',
        lore: 'An envoy from a neighboring realm seeks safe passage through your province.',
        question: 'In the ancient Arthashastra, which state official oversaw safe merchant trade routes and fortress checkpoints?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_safe_passage', name: 'Safe Route', description: 'Immune from capture for 1 full round' },
        options: [
          { id: 'opt_1', text: 'Samsthadhyaksha (Route & Market Overseer)', isCorrect: true },
          { id: 'opt_2', text: 'Koshadhyaksha (Royal Vault Keeper)', isCorrect: false },
          { id: 'opt_3', text: 'Durgapala (Fortress Guard)', isCorrect: false },
        ],
      },
      {
        id: 'rajya_easy_2',
        title: 'The Palace Granary',
        difficulty: 'easy',
        lore: 'The royal storekeeper prepares rations for the kingdom.',
        question: 'Which ancient grain was stored in royal granaries for up to a decade as drought insurance?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_extra_step', name: 'Granary Rations', description: 'Advance pawn by +1 extra step' },
        options: [
          { id: 'opt_1', text: 'Millets (Ragi and Foxtail Millet)', isCorrect: true },
          { id: 'opt_2', text: 'Imported Spices', isCorrect: false },
          { id: 'opt_3', text: 'Fresh Sugarcane', isCorrect: false },
        ],
      },
    ],
    medium: [
      {
        id: 'rajya_med_1',
        title: 'The Wise Advisor',
        difficulty: 'medium',
        lore: 'Your royal council has presented a critical state dilemma before the emperor.',
        question: 'What ancient Maurya & Chola strategy helped the kingdom survive dry seasons without depleting the royal treasury?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_double_roll', name: 'Double Roll', description: 'Roll two consecutive turns on physical board' },
        options: [
          { id: 'opt_1', text: 'Build state rainwater reservoirs & community stepwells', isCorrect: true },
          { id: 'opt_2', text: 'Impose emergency grain taxes on local farmers', isCorrect: false },
          { id: 'opt_3', text: 'Host a grand royal tournament in the capital', isCorrect: false },
        ],
      },
    ],
    hard: [
      {
        id: 'rajya_hard_1',
        title: 'The Emperor’s Gambit',
        difficulty: 'hard',
        lore: 'Emperor Krishnadevaraya faces a multi-front diplomatic standoff.',
        question: 'In Indian statecraft (Saptanga theory), what constitutes the 7th vital limb that guarantees a kingdom’s supreme sovereignty?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_teleport_home', name: 'Emperor’s Command', description: 'Teleport any friendly pawn directly into the inner Katte' },
        options: [
          { id: 'opt_1', text: 'Mitra (Faithful Strategic Allies & Treaties)', isCorrect: true },
          { id: 'opt_2', text: 'Sena (Mercenary Cavalry)', isCorrect: false },
          { id: 'opt_3', text: 'Kosha (Hidden Mountain Treasure)', isCorrect: false },
        ],
      },
    ],
  },
  kshetra_devalaya: {
    easy: [
      {
        id: 'temple_easy_1',
        title: 'The Pillar of Lights',
        difficulty: 'easy',
        lore: 'The temple archaka lights the evening lamps at the entrance.',
        question: 'What is the towering pillar erected outside temple courtyards to hold oil lamps during festivities called?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_glow_shield', name: 'Deepa Shield', description: 'Pawn cannot be attacked on normal squares for 1 turn' },
        options: [
          { id: 'opt_1', text: 'Deepa Sthambha', isCorrect: true },
          { id: 'opt_2', text: 'Gopuram Vimana', isCorrect: false },
          { id: 'opt_3', text: 'Bali Peetham', isCorrect: false },
        ],
      },
    ],
    medium: [
      {
        id: 'temple_med_1',
        title: 'The Sacred Gateway',
        difficulty: 'medium',
        lore: 'The chief Sthapati (temple architect) challenges you at the temple gopuram.',
        question: 'In Dravidian temple architecture, what sacred hall connects the pilgrim pathway to the innermost Garbhagriha?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_katte_sanctuary', name: 'Katte Sanctuary', description: 'Move immediately to the nearest safe Katte square' },
        options: [
          { id: 'opt_1', text: 'Ardha Mandapa (Pillared Hall of Transition)', isCorrect: true },
          { id: 'opt_2', text: 'Natya Shala (Hall of Dance)', isCorrect: false },
          { id: 'opt_3', text: 'Kalyana Mandapa', isCorrect: false },
        ],
      },
    ],
    hard: [
      {
        id: 'temple_hard_1',
        title: 'Cosmic Geometry of Vastu',
        difficulty: 'hard',
        lore: 'The grand master builder reveals the sacred geometry of the temple plan.',
        question: 'In Vastu Shastra, the 81-square grid (Paramasayika Mandala) aligns the temple sanctum with which supreme cosmic center?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_divine_blessing', name: 'Brahmasthana Halo', description: 'All your pawns gain double movement for 2 rounds' },
        options: [
          { id: 'opt_1', text: 'Brahmasthana (Cosmic Center of Pure Energy)', isCorrect: true },
          { id: 'opt_2', text: 'Yama Dik (Southern Horizon)', isCorrect: false },
          { id: 'opt_3', text: 'Agni Kona (Fire Corner)', isCorrect: false },
        ],
      },
    ],
  },
  navarasa: {
    easy: [
      {
        id: 'navarasa_easy_1',
        title: 'The Graceful Glance',
        difficulty: 'easy',
        lore: 'A young classical dancer demonstrates the rasa of beauty and devotion.',
        question: 'Which of the nine rasas in Natyashastra represents divine love, aesthetic beauty, and romance?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_charm', name: 'Aesthetic Grace', description: 'Swap positions with an adjacent friendly pawn' },
        options: [
          { id: 'opt_1', text: 'Shringara Rasa', isCorrect: true },
          { id: 'opt_2', text: 'Bibhatsa Rasa', isCorrect: false },
          { id: 'opt_3', text: 'Bhayanaka Rasa', isCorrect: false },
        ],
      },
    ],
    medium: [
      {
        id: 'navarasa_med_1',
        title: 'The Master of Expressions',
        difficulty: 'medium',
        lore: 'A master Natya dancer challenges you to identify the supreme emotion of valor.',
        question: 'In Bharata Muni’s Natyashastra, which rasa embodies unshakeable heroic courage, duty, and nobility?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_heroic_surge', name: 'Heroic Surge', description: 'Gain 1 bonus roll after moving' },
        options: [
          { id: 'opt_1', text: 'Veera Rasa (The Heroic Spirit)', isCorrect: true },
          { id: 'opt_2', text: 'Raudra Rasa (The Fury of Agni)', isCorrect: false },
          { id: 'opt_3', text: 'Adbhuta Rasa (The Sense of Wonder)', isCorrect: false },
        ],
      },
    ],
    hard: [
      {
        id: 'navarasa_hard_1',
        title: 'The Tenth Dimension',
        difficulty: 'hard',
        lore: 'The philosopher Abhinavagupta ponders the ultimate stillness of the mind.',
        question: 'Which transcendental emotion was added by Abhinavagupta to complete the aesthetic journey into supreme tranquility?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_shanta_peace', name: 'Shanta Serenity', description: 'Freeze all opponent movement on the board for 1 turn' },
        options: [
          { id: 'opt_1', text: 'Shanta Rasa (Tranquil Peace & Detachment)', isCorrect: true },
          { id: 'opt_2', text: 'Vatsalya Rasa (Parental Affection)', isCorrect: false },
          { id: 'opt_3', text: 'Bhakti Rasa (Pure Devotion)', isCorrect: false },
        ],
      },
    ],
  },
  panchabootha: {
    easy: [
      {
        id: 'panch_easy_1',
        title: 'The Sacred Flame',
        difficulty: 'easy',
        lore: 'The hermit tending the sacrificial fire asks of the elemental forces.',
        question: 'Which of the five primordial elements represents light, heat, vision (Rupa), and transformation?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_fire_speed', name: 'Agni Spark', description: 'Reroll any roll of 1 or 2' },
        options: [
          { id: 'opt_1', text: 'Agni (Tejas / Sacred Fire)', isCorrect: true },
          { id: 'opt_2', text: 'Prithvi (Mother Earth)', isCorrect: false },
          { id: 'opt_3', text: 'Jala (Pure Water)', isCorrect: false },
        ],
      },
    ],
    medium: [
      {
        id: 'panch_med_1',
        title: 'The Elemental Guardian',
        difficulty: 'medium',
        lore: 'The guardian sage of the forest asks the mystery of primordial space.',
        question: 'According to Vedic cosmology, which of the five elements governs sound (Shabda) and vast celestial space?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_ether_glide', name: 'Ether Glide', description: 'Leap over opponent blockades without stopping' },
        options: [
          { id: 'opt_1', text: 'Akasha (Ether / Cosmic Space)', isCorrect: true },
          { id: 'opt_2', text: 'Vayu (Wind / Atmospheric Flow)', isCorrect: false },
          { id: 'opt_3', text: 'Jala (Primordial Water)', isCorrect: false },
        ],
      },
    ],
    hard: [
      {
        id: 'panch_hard_1',
        title: 'The Tanmatra Matrix',
        difficulty: 'hard',
        lore: 'The ancient Samkhya philosopher asks of the subtle senses.',
        question: 'In Samkhya philosophy, which elemental Tanmatra (subtle essence) gives rise to the sense of smell in Prithvi?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_earth_anchor', name: 'Prithvi Anchor', description: 'Prevent opponent from capturing your lead pawn for 3 rounds' },
        options: [
          { id: 'opt_1', text: 'Gandha Tanmatra (Subtle Essence of Fragrance)', isCorrect: true },
          { id: 'opt_2', text: 'Rasa Tanmatra (Subtle Taste)', isCorrect: false },
          { id: 'opt_3', text: 'Sparsha Tanmatra (Subtle Touch)', isCorrect: false },
        ],
      },
    ],
  },
  kala_yuga: {
    easy: [
      {
        id: 'kala_easy_1',
        title: 'The Cycle of Eras',
        difficulty: 'easy',
        lore: 'The Gurukul astronomer explains the four cosmic epochs of time.',
        question: 'What is the first, golden era of truth, virtue, and cosmic order called in Indian cosmology?',
        cost: RIDDLE_COSTS.easy,
        reward: 800,
        advantage: { id: 'adv_satya_boost', name: 'Satya Epoch', description: 'Advance pawn by +2 steps' },
        options: [
          { id: 'opt_1', text: 'Satya Yuga (Krita Yuga)', isCorrect: true },
          { id: 'opt_2', text: 'Treta Yuga', isCorrect: false },
          { id: 'opt_3', text: 'Dvapara Yuga', isCorrect: false },
        ],
      },
    ],
    medium: [
      {
        id: 'kala_med_1',
        title: 'The Celestial Musician',
        difficulty: 'medium',
        lore: 'The court Gandharva tests your understanding of Indian classical instruments.',
        question: 'Which ancient 24-fret string instrument crafted from jackfruit wood is considered the Queen of all Indian melody?',
        cost: RIDDLE_COSTS.medium,
        reward: 1500,
        advantage: { id: 'adv_melodic_leap', name: 'Melodic Leap', description: 'Advance forward +4 steps immediately' },
        options: [
          { id: 'opt_1', text: 'Saraswati Veena', isCorrect: true },
          { id: 'opt_2', text: 'Ektara Folk Lute', isCorrect: false },
          { id: 'opt_3', text: 'Mridangam Drum', isCorrect: false },
        ],
      },
    ],
    hard: [
      {
        id: 'kala_hard_1',
        title: 'The Surya Siddhanta Calculation',
        difficulty: 'hard',
        lore: 'The ancient astronomer calculates the celestial movement of the planets.',
        question: 'What ancient Indian mathematical treaty accurately calculated the Earth’s diameter and planetary sidereal periods in the 5th century CE?',
        cost: RIDDLE_COSTS.hard,
        reward: 2500,
        advantage: { id: 'adv_astronomy_warp', name: 'Cosmic Warp', description: 'Move pawn directly to the final inner track of Chowkabara' },
        options: [
          { id: 'opt_1', text: 'Surya Siddhanta & Aryabhatiya', isCorrect: true },
          { id: 'opt_2', text: 'Sulba Sutras', isCorrect: false },
          { id: 'opt_3', text: 'Charaka Samhita', isCorrect: false },
        ],
      },
    ],
  },
};

/**
 * buyRiddle - calls Member 2 pure game logic
 */
export const buyRiddle = async (player, riddle) => {
  console.log('[Riddle Service] Calling Member 2 buyRiddle()', { player, riddle });
  return member2BuyRiddle(player, riddle);
};

/**
 * getRandomRiddle - picks a random riddle using Member 2 logic
 */
export const getRandomRiddle = (themeKey = 'rajya', difficulty = 'medium') => {
  const themePool = themeRiddlesDatabase[themeKey] || themeRiddlesDatabase.rajya;
  const list = themePool[difficulty] || themePool.medium || [];
  const picked = member2GetRandomRiddle(list);
  console.log('[Riddle Service] Calling Member 2 getRandomRiddle()', { themeKey, difficulty, picked });
  return picked || list[0];
};

/**
 * submitAnswer - calls Member 2 pure game logic
 */
export const submitAnswer = async (player, solved, advantage) => {
  console.log('[Riddle Service] Calling Member 2 submitAnswer()', { player, solved, advantage });
  return member2SubmitAnswer(player, solved, advantage);
};

/**
 * validateAnswer - calls Member 2 validateAnswer
 */
export const validateAnswer = (solved) => {
  return member2ValidateAnswer(solved);
};
