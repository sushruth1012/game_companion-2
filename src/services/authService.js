import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../lib/firebase";

const googleProvider = new GoogleAuthProvider();

// ============================================================
// GOOGLE LOGIN
// ============================================================

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const googleId =
      user.providerData?.find(
        (provider) => provider.providerId === "google.com"
      )?.uid || "";

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          photo: user.photoURL || "",
          googleId,
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (firestoreErr) {
      console.warn("[Auth Service] Firestore sync notice (continuing):", firestoreErr);
    }

    const userData = {
      uid: user.uid,
      displayName: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      googleId,
    };

    sessionStorage.setItem("currentUser", JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error("[Auth Service] Google login failed:", error);
    if (error.code === "auth/unauthorized-domain") {
      const currentHost = window.location.hostname;
      error.customMessage = `Domain "${currentHost}" is not authorized in Firebase Console. Add it in Firebase Console -> Authentication -> Settings -> Authorized Domains.`;
    }
    throw error;
  }
};

// ============================================================
// GUEST / DEMO LOGIN (Fallback when domain not yet whitelisted)
// ============================================================

export const loginAsGuest = (displayName = "Royal Traveler") => {
  const guestUser = {
    uid: `traveler_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    displayName: displayName || "Royal Traveler",
    email: "traveler@heritagegames.in",
    photoURL: "",
    googleId: "guest_google_id",
    isGuest: true,
  };

  sessionStorage.setItem("currentUser", JSON.stringify(guestUser));
  return guestUser;
};

// ============================================================
// LOGOUT
// ============================================================

export const logoutUser = async () => {
  try {
    await signOut(auth).catch(() => {});
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentGameSession");
    sessionStorage.removeItem("yatraSessionId");
    sessionStorage.removeItem("activeGamePlayers");
    localStorage.removeItem("active_device_session");
    localStorage.removeItem("activated_box_code");
    return true;
  } catch (error) {
    console.error("[Auth Service] Logout failed:", error);
    return true;
  }
};

// ============================================================
// CURRENT USER
// ============================================================

export const getCurrentUser = () => {
  const user = auth.currentUser;

  if (user) {
    return {
      uid: user.uid,
      displayName: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      googleId:
        user.providerData?.find(
          (provider) => provider.providerId === "google.com"
        )?.uid || "",
    };
  }

  const stored = sessionStorage.getItem("currentUser");
  return stored ? JSON.parse(stored) : null;
};

// ============================================================
// JOIN GAME
// ============================================================

export const joinGame = async (gameCode) => {
  if (!gameCode?.trim()) {
    throw new Error("Please enter a valid game code.");
  }

  const session = {
    gameCode: gameCode.trim().toUpperCase(),
    joinedAt: new Date().toISOString(),
  };

  sessionStorage.setItem("currentGameSession", JSON.stringify(session));
  return session;
};