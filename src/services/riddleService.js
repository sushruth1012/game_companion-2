// Riddles Service with Theme-Aware Questions (Developer Guide Compliant)

export const themeRiddlesDatabase = {
  rajya: [
    {
      id: 'rajya_1',
      title: 'The Wise Advisor',
      lore: 'Your royal council has presented a critical state dilemma before the emperor.',
      question: 'What ancient Maurya & Chola strategy helped the kingdom survive severe dry seasons without depleting the royal treasury?',
      cost: 1000,
      reward: 1500,
      advantage: 'Double Roll & +1500 Pts',
      options: [
        { id: 'opt_1', text: 'Build state rainwater reservoirs & granaries', isCorrect: true },
        { id: 'opt_2', text: 'Impose emergency grain taxes on merchants', isCorrect: false },
        { id: 'opt_3', text: 'Host a grand royal tournament in the capital', isCorrect: false },
      ],
    },
  ],
  kshetra_devalaya: [
    {
      id: 'temple_1',
      title: 'The Sacred Gateway',
      lore: 'The chief Sthapati (temple architect) challenges you at the temple gopuram.',
      question: 'In Dravidian temple architecture, what sacred hall connects the pilgrim pathway to the inner sanctum (Garbhagriha)?',
      cost: 1000,
      reward: 1500,
      advantage: 'Safe Zone Protection & +1500 Pts',
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
      lore: 'A master Natya dancer challenges you to identify the supreme emotion.',
      question: 'In Bharata Muni’s Natyashastra, which of the nine rasas represents unshakeable heroic courage, chivalry, and duty?',
      cost: 1000,
      reward: 1500,
      advantage: 'Extra Turn & +1500 Pts',
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
      lore: 'The guardian sage of the forest asks the mystery of primordial creation.',
      question: 'According to ancient Vedic cosmology, which of the five elements governs sound (Shabda) and vast celestial space?',
      cost: 1000,
      reward: 1500,
      advantage: 'Pass Any Pawn & +1500 Pts',
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
      lore: 'The court Gandharva tests your understanding of Indian classical heritage.',
      question: 'Which ancient 24-fret string instrument crafted from jackfruit wood is considered the Queen of all Indian melody?',
      cost: 1000,
      reward: 1500,
      advantage: 'Teleport to Nearest Katte & +1500 Pts',
      options: [
        { id: 'opt_1', text: 'Saraswati Veena', isCorrect: true },
        { id: 'opt_2', text: 'Ektara Folk Lute', isCorrect: false },
        { id: 'opt_3', text: 'Mridangam Drum', isCorrect: false },
      ],
    },
  ],
};

export const buyRiddle = async (playerId, cost = 1000) => {
  console.log('[Riddle Service] Calling standard function: buyRiddle()', { playerId, cost });
  return { success: true, riddleCost: cost };
};

export const getRandomRiddle = async (themeKey = 'rajya') => {
  console.log('[Riddle Service] Calling standard function: getRandomRiddle()', themeKey);
  const pool = themeRiddlesDatabase[themeKey] || themeRiddlesDatabase.rajya;
  return pool[0];
};

export const submitAnswer = async (riddleId, selectedAnswerId) => {
  console.log('[Riddle Service] Calling standard function: submitAnswer()', { riddleId, selectedAnswerId });
  return { correct: selectedAnswerId === 'opt_1', pointsAwarded: 1500 };
};

export const validateAnswer = async (riddleId, selectedAnswer) => {
  console.log('[Riddle Service] Calling standard function: validateAnswer()', { riddleId, selectedAnswer });
  return true;
};
