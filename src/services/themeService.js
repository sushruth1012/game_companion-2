// Themes Service
export const getThemes = async () => {
  console.log('[Theme Service] Calling standard function: getThemes()');
  return [
    { id: 'heritage', name: 'Royal Heritage', primaryColor: '#6B4F3A', accentColor: '#D9A441' },
    { id: 'monsoon', name: 'Monsoon Forest', primaryColor: '#355E3B', accentColor: '#A8D5BA' },
    { id: 'terracotta', name: 'Vedic Terracotta', primaryColor: '#C76B4A', accentColor: '#F4D06F' },
  ];
};

export const setTheme = async (themeId) => {
  console.log('[Theme Service] Calling standard function: setTheme()', themeId);
  localStorage.setItem('selectedTheme', themeId);
  return { activeTheme: themeId };
};
