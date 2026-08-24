// Turns Service
export const nextTurn = async (gameId) => {
  console.log('[Turn Service] Calling standard function: nextTurn()', gameId);
  return { nextPlayerIndex: 1 };
};

export const previousTurn = async (gameId) => {
  console.log('[Turn Service] Calling standard function: previousTurn()', gameId);
  return { previousPlayerIndex: 0 };
};

export const getCurrentTurn = async (gameId) => {
  console.log('[Turn Service] Calling standard function: getCurrentTurn()', gameId);
  return { activePlayerIndex: 0 };
};
