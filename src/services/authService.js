// Standard Authentication Service (Frontend Stubs per Integration Contract)

export const loginWithGoogle = async () => {
  console.log('[Auth Service] Calling standard function: loginWithGoogle()');
  // Simulated frontend response until Member 3 (Backend) connects Firebase
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUser = {
        uid: 'usr_g_' + Math.random().toString(36).substring(2, 9),
        displayName: 'Royal Voyager',
        email: 'player@heritagegames.in',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      };
      sessionStorage.setItem('currentUser', JSON.stringify(mockUser));
      resolve(mockUser);
    }, 600);
  });
};

export const logoutUser = async () => {
  console.log('[Auth Service] Calling standard function: logoutUser()');
  sessionStorage.removeItem('currentUser');
  return true;
};

export const joinGame = async (gameCode) => {
  console.log(`[Auth Service] Calling standard function: joinGame("${gameCode}")`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!gameCode || gameCode.trim().length === 0) {
        reject(new Error('Please enter a valid activation code.'));
        return;
      }
      const session = {
        gameCode: gameCode.toUpperCase(),
        joinedAt: new Date().toISOString(),
        gameName: 'Chowkabara Heritage Edition',
      };
      sessionStorage.setItem('currentGameSession', JSON.stringify(session));
      resolve(session);
    }, 500);
  });
};

export const getCurrentUser = () => {
  console.log('[Auth Service] Calling standard function: getCurrentUser()');
  const stored = sessionStorage.getItem('currentUser');
  return stored ? JSON.parse(stored) : null;
};
