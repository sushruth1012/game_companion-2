// Standard Players Service - Integrated with Member 2 (src/lib/gameLogic.ts)
import { createPlayer as member2CreatePlayer, STARTING_MUDRAS } from '../lib/gameLogic';

export { STARTING_MUDRAS };

export const addPlayer = async (player) => {
  console.log('[Player Service] Calling standard function: addPlayer()', player);
  const mudrasPlayer = member2CreatePlayer(
    player.uid || `CHB_${Date.now()}`,
    typeof player.age === 'number' ? player.age : 20
  );

  return {
    id: player.id || 'p_' + Date.now(),
    name: player.name || `Player`,
    uid: mudrasPlayer.uid,
    age: mudrasPlayer.age,
    mudras: mudrasPlayer.mudras,
    points: mudrasPlayer.mudras, // 6000 Mudras/Points initially per gameLogic
    color: player.color || '#355E3B',
    pawnIndex: player.pawnIndex ?? 0,
  };
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
