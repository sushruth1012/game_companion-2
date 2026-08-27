import {
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase.js";


// ============================================================
// DEFAULT THEMES
// ============================================================

const defaultThemes = [
  {
    id: "heritage",
    name: "Royal Heritage",
    primaryColor: "#6B4F3A",
    accentColor: "#D9A441",
  },
  {
    id: "monsoon",
    name: "Monsoon Forest",
    primaryColor: "#355E3B",
    accentColor: "#A8D5BA",
  },
  {
    id: "terracotta",
    name: "Vedic Terracotta",
    primaryColor: "#C76B4A",
    accentColor: "#F4D06F",
  },
];


// ============================================================
// GET THEMES
// ============================================================

export const getThemes = async () => {

  const snapshot =
    await getDocs(
      collection(db, "themes")
    );


  // If Firebase has themes, use them.
  if (!snapshot.empty) {

    return snapshot.docs.map(
      (themeDoc) => ({
        id: themeDoc.id,
        ...themeDoc.data(),
      })
    );
  }


  // Otherwise return the existing project themes.
  return defaultThemes;
};


// ============================================================
// SET THEME
// ============================================================

export const setTheme = async (themeId) => {

  if (!themeId) {
    throw new Error(
      "Theme ID is required."
    );
  }


  localStorage.setItem(
    "selectedTheme",
    themeId
  );


  return {
    activeTheme: themeId,
  };
};


// ============================================================
// OPTIONAL: INITIALIZE DEFAULT THEMES
// ============================================================

export const initializeThemes = async () => {

  for (
    const theme of defaultThemes
  ) {

    await setDoc(
      doc(
        db,
        "themes",
        theme.id
      ),
      theme,
      {
        merge: true,
      }
    );
  }

  return defaultThemes;
};