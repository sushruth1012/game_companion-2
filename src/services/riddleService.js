// Standard Riddles Service - Integrated with Member 2 Game Logic (src/lib/gameLogic.ts)
import {
  buyRiddle as member2BuyRiddle,
  getRandomRiddle as member2GetRandomRiddle,
  submitAnswer as member2SubmitAnswer,
  validateAnswer as member2ValidateAnswer,
  STARTING_MUDRAS,
  RIDDLE_COSTS,
} from '../lib/gameLogic';

export { STARTING_MUDRAS, RIDDLE_COSTS };

// Theme-specific riddle database with difficulty tags
export const themeRiddlesDatabase = {
  rajya: [
    {
      id: 'rajya_1',
      title: 'The Wise Advisor',
      difficulty: 'medium',
      lore: 'Your royal council has presented a critical state dilemma before the emperor.',
      question: 'What ancient Maurya & Chola strategy helped the kingdom survive severe dry seasons without depleting the royal treasury?',
      cost: 1000,
      reward: 1500,
      advantage: { id: 'adv_double', name: 'Double Move', description: 'Roll twice on your next turn' },
      options: [
        { id: 'opt_1', text: 'Build state rainwater reservoirs & granaries', isCorrect: true },
        { id: 'opt_2', text: 'Impose emergency grain taxes on merchants', isCorrect: false },
        { id: 'opt_3', text: 'Host a grand royal tournament in the capital', isCorrect: false },
      ],
    },
    {
      id: 'rajya_2',
      title: 'Royal Envoy',
      difficulty: 'easy',
      lore: 'An envoy from a neighboring realm seeks an alliance treaty.',
      question: 'In the Arthashastra, which state department oversees safe trade routes and courier fortresses?',
      cost: 500,
      reward: 800,
      advantage: { id: 'adv_safe', name: 'Safe Haven', description: 'Immune from capture for 1 round' },
      options: [
        { id: 'opt_1', text: 'Samsthadhyaksha (Market & Route Overseer)', isCorrect: true },
        { id: 'opt_2', text: 'Koshadhyaksha (Royal Vault Keeper)', isCorrect: false },
        { id: 'opt_3', text: 'Durgapala (Fort Commander)', isCorrect: false },
      ],
    },
  ],
  kshetra_devalaya: [
    {
      id: 'temple_1',
      title: 'The Sacred Gateway',
      difficulty: 'medium',
      lore: 'The chief Sthapati (temple architect) challenges you at the temple gopuram.',
      question: 'In Dravidian temple architecture, what sacred hall connects the pilgrim pathway to the inner sanctum (Garbhagriha)?',
      cost: 1000,
      reward: 1500,
      advantage: { id: 'adv_safe_zone', name: 'Katte Sanctuary', description: 'Instantly move pawn to nearest safe Katte' },
      options: [
        { id: 'opt_1', text: 'Ardha Mandapa (Pillared Hall of Transition)', isCorrect: true },
        { id: 'opt_2', text: 'Natya Shala (Hall of Dance)', isCorrect: false },
        { id: 'opt_3', text: 'Deepa Sthambha (Pillar of Lights)', isCorrect: false },
      ],
    },
  ],
  navarasa: [
    {
      id: 'navarasa_1',
      title: 'The Master of Expressions',
      difficulty: 'medium',
      lore: 'A master Natya dancer challenges you to identify the supreme emotion.',
      question: 'In Bharata Muni’s Natyashastra, which of the nine rasas represents unshakeable heroic courage, chivalry, and duty?',
      cost: 1000,
      reward: 1500,
      advantage: { id: 'adv_extra_turn', name: 'Heroic Surge', description: 'Gain 1 extra consecutive roll' },
      options: [
        { id: 'opt_1', text: 'Veera Rasa (The Heroic Spirit)', isCorrect: true },
        { id: 'opt_2', text: 'Raudra Rasa (The Fury of Agni)', isCorrect: false },
        { id: 'opt_3', text: 'Adbhuta Rasa (The Sense of Wonder)', isCorrect: false },
      ],
    },
  ],
  panchabootha: [
    {
      id: 'elements_1',
      title: 'The Elemental Guardian',
      difficulty: 'medium',
      lore: 'The guardian sage of the forest asks the mystery of primordial creation.',
      question: 'According to ancient Vedic cosmology, which of the five elements governs sound (Shabda) and vast celestial space?',
      cost: 1000,
      reward: 1500,
      advantage: { id: 'adv_pass_pawn', name: 'Ether Glide', description: 'Leap over opponent blockade pawns' },
      options: [
        { id: 'opt_1', text: 'Akasha (Ether / Cosmic Space)', isCorrect: true },
        { id: 'opt_2', text: 'Vayu (Wind / Atmospheric Flow)', isCorrect: false },
        { id: 'opt_3', text: 'Jala (Sacred Primordial Water)', isCorrect: false },
      ],
    },
  ],
  kala_yuga: [
    {
      id: 'arts_1',
      title: 'The Celestial Musician',
      difficulty: 'medium',
      lore: 'The court Gandharva tests your understanding of Indian classical heritage.',
      question: 'Which ancient 24-fret string instrument crafted from jackfruit wood is considered the Queen of all Indian melody?',
      cost: 1000,
      reward: 1500,
      advantage: { id: 'adv_teleport', name: 'Melodic Leap', description: 'Advance forward +4 steps' },
      options: [
        { id: 'opt_1', text: 'Saraswati Veena', isCorrect: true },
        { id: 'opt_2', text: 'Ektara Folk Lute', isCorrect: false },
        { id: 'opt_3', text: 'Mridangam Drum', isCorrect: false },
      ],
    },
  ],
};

/**
 * buyRiddle - calls Member 2 game logic
 */
export const buyRiddle = async (playerOrId, riddleOrCost) => {
  console.log('[Riddle Service] Executing Member 2 buyRiddle()', { playerOrId, riddleOrCost });

  if (typeof playerOrId === 'object' && typeof riddleOrCost === 'object') {
    return member2BuyRiddle(playerOrId, riddleOrCost);
  }

  // Adapter for UI invocation
  const cost = typeof riddleOrCost === 'number' ? riddleOrCost : 1000;
  return { success: true, riddleCost: cost };
};

/**
 * getRandomRiddle - calls Member 2 getRandomRiddle()
 */
export const getRandomRiddle = async (themeKey = 'rajya') => {
  const pool = themeRiddlesDatabase[themeKey] || themeRiddlesDatabase.rajya;
  const picked = member2GetRandomRiddle(pool) || pool[0];
  console.log('[Riddle Service] Executing Member 2 getRandomRiddle()', picked);
  return picked;
};

/**
 * submitAnswer - calls Member 2 submitAnswer()
 */
export const submitAnswer = async (player, solved, advantage) => {
  console.log('[Riddle Service] Executing Member 2 submitAnswer()', { player, solved, advantage });
  return member2SubmitAnswer(player, solved, advantage);
};

/**
 * validateAnswer - calls Member 2 validateAnswer()
 */
export const validateAnswer = (solved) => {
  return member2ValidateAnswer(solved);
};
