// Game Service (Standard Function Names)
export const createGame = async (gameConfig) => {
  console.log('[Game Service] Calling standard function: createGame()', gameConfig);
  return { id: 'game_' + Date.now(), ...gameConfig, status: 'created' };
};

export const startGame = async (gameId) => {
  console.log('[Game Service] Calling standard function: startGame()', gameId);
  return { id: gameId, status: 'active', startedAt: new Date().toISOString() };
};

export const endGame = async (gameId) => {
  console.log('[Game Service] Calling standard function: endGame()', gameId);
  return { id: gameId, status: 'completed', endedAt: new Date().toISOString() };
};

export const getGame = async (gameId) => {
  console.log('[Game Service] Calling standard function: getGame()', gameId);
  return { id: gameId, name: 'Chowkabara', status: 'active' };
};

export const updateGame = async (gameId, updates) => {
  console.log('[Game Service] Calling standard function: updateGame()', gameId, updates);
  return { id: gameId, ...updates };
};
