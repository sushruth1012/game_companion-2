import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase.js";


// ============================================================
// SESSION SERVICE
// ============================================================
//
// Cross-device restrictions are DISABLED.
//
// Multiple browsers/devices using the same Google account
// are allowed to play simultaneously.
//
// These functions remain available for compatibility with
// the existing project.
// ============================================================


// ============================================================
// START SESSION
// ============================================================

export const startSession = async (
  user,
  gameId = "chowkabara_live_session"
) => {

  if (!user) {

    throw new Error(
      "User is not logged in."
    );

  }


  const sessionId =
    "YATRA-" +
    crypto.randomUUID();


  const session = {

    sessionId,

    uid:
      user.uid,

    email:
      user.email || "",

    gameId,

    status:
      "active",

    startedAt:
      serverTimestamp(),

    lastActivityAt:
      serverTimestamp(),

  };


  /*
   * Each browser gets its own session document.
   *
   * This does NOT lock the Google account.
   */

  await setDoc(
    doc(
      db,
      "users",
      user.uid,
      "sessions",
      sessionId
    ),
    session
  );


  return {

    success:
      true,

    active:
      false,

    sessionId,

    ...session,

  };

};


// ============================================================
// RECORD ACTIVITY
// ============================================================

export const recordActivity = async (
  user,
  sessionId
) => {

  if (
    !user ||
    !sessionId
  ) {

    return false;

  }


  try {

    await updateDoc(
      doc(
        db,
        "users",
        user.uid,
        "sessions",
        sessionId
      ),
      {

        lastActivityAt:
          serverTimestamp(),

      }
    );


    return true;

  } catch (error) {

    console.error(
      "[Session Service] Activity update failed:",
      error
    );


    return false;

  }

};


// ============================================================
// CHECK SESSION
// ============================================================
//
// This only checks THIS browser's session.
// It does not check whether another browser is playing.
// ============================================================

export const checkSession = async (
  user,
  sessionId
) => {

  if (
    !user ||
    !sessionId
  ) {

    return {

      active:
        false,

    };

  }


  try {

    const snapshot =
      await getDoc(
        doc(
          db,
          "users",
          user.uid,
          "sessions",
          sessionId
        )
      );


    if (
      !snapshot.exists()
    ) {

      return {

        active:
          false,

      };

    }


    const data =
      snapshot.data();


    return {

      active:
        data.status ===
        "active",

      sessionId,

      ...data,

    };

  } catch (error) {

    console.error(
      "[Session Service] Session check failed:",
      error
    );


    return {

      active:
        false,

    };

  }

};


// ============================================================
// END SESSION
// ============================================================

export const endSession = async (
  user,
  sessionId
) => {

  if (
    !user ||
    !sessionId
  ) {

    return false;

  }


  try {

    await updateDoc(
      doc(
        db,
        "users",
        user.uid,
        "sessions",
        sessionId
      ),
      {

        status:
          "ended",

        endedAt:
          serverTimestamp(),

      }
    );


    return true;

  } catch (error) {

    console.error(
      "[Session Service] End session failed:",
      error
    );


    return false;

  }

};