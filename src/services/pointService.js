// Points Service
export const addPoints = async (playerId, amount) => {
  console.log('[Point Service] Calling standard function: addPoints()', { playerId, amount });
  return { playerId, points: amount };
};

export const deductPoints = async (playerId, amount) => {
  console.log('[Point Service] Calling standard function: deductPoints()', { playerId, amount });
  return { playerId, points: -amount };
};

export const updatePoints = async (playerId, newTotal) => {
  console.log('[Point Service] Calling standard function: updatePoints()', { playerId, newTotal });
  return { playerId, points: newTotal };
};
