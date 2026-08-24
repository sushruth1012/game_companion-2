// Players Service
export const addPlayer = async (player) => {
  console.log('[Player Service] Calling standard function: addPlayer()', player);
  return { id: 'p_' + Date.now(), ...player };
};

export const removePlayer = async (playerId) => {
  console.log('[Player Service] Calling standard function: removePlayer()', playerId);
  return true;
};

export const updatePlayer = async (playerId, updates) => {
  console.log('[Player Service] Calling standard function: updatePlayer()', playerId, updates);
  return { id: playerId, ...updates };
};

export const getPlayers = async (gameId) => {
  console.log('[Player Service] Calling standard function: getPlayers()', gameId);
  return [];
};
