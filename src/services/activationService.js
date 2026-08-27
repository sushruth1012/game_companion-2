import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase.js";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwY-XeVrowYic6_GCWtmxtPp-QvpKP7U1MvovUAIzp3LAvyADyNF8dxjv9ku2A6sbYo/exec";

// ============================================================
// CHECK EXISTING ACTIVATION
// ============================================================
export const checkActivation = async (email, googleId, uid) => {
  try {
    // 1. Check Firestore user profile first
    if (uid) {
      const userSnap = await getDoc(doc(db, "users", uid));
      if (userSnap.exists() && userSnap.data().isActivated) {
        return {
          activated: true,
          activationCode: userSnap.data().activationCode || "",
          message: "Game board activated.",
        };
      }
    }

    if (!email || !googleId) {
      return { activated: false, message: "Account details required." };
    }

    // 2. Query Google Apps Script
    const url =
      `${APPS_SCRIPT_URL}` +
      `?action=checkUser` +
      `&email=${encodeURIComponent(email)}` +
      `&googleId=${encodeURIComponent(googleId)}`;

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn("[Activation] Backend check fallback:", error);
  }

  // Check local session activation cache
  const localActivated = sessionStorage.getItem("isGameActivated") === "true";
  return {
    activated: localActivated,
    message: localActivated ? "Game board activated." : "Activation required.",
  };
};

// ============================================================
// ACTIVATE / REDEEM CODE FROM PHYSICAL GAME BOARD
// ============================================================
export const activateCode = async (code, email, googleId, name, uid) => {
  if (!code?.trim()) {
    throw new Error("Please enter an activation code from your physical game board box.");
  }

  const cleanCode = code.trim().toUpperCase();

  try {
    // 1. Send to Apps Script if parameters provided
    if (email && googleId) {
      const url =
        `${APPS_SCRIPT_URL}` +
        `?action=activate` +
        `&code=${encodeURIComponent(cleanCode)}` +
        `&email=${encodeURIComponent(email)}` +
        `&googleId=${encodeURIComponent(googleId)}` +
        `&name=${encodeURIComponent(name || "")}`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data && data.success === false && data.error) {
            throw new Error(data.error);
          }
        }
      } catch (fetchErr) {
        console.warn("[Activation] Apps Script notice (recording in Firestore):", fetchErr);
      }
    }

    // 2. Persist in Firestore if user is authenticated
    if (uid) {
      await setDoc(
        doc(db, "users", uid),
        {
          isActivated: true,
          activationCode: cleanCode,
          activatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    // 3. Store in session
    sessionStorage.setItem("isGameActivated", "true");
    sessionStorage.setItem("yatraActivationCode", cleanCode);

    return {
      success: true,
      code: cleanCode,
      message: "Physical game board successfully activated!",
    };
  } catch (error) {
    console.error("[Activation] Activation error:", error);
    throw error;
  }
};

export default {
  checkActivation,
  activateCode,
};