import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../lib/firebase.js";

import {
  startSession,
  endSession,
  recordActivity,
} from "./sessionService.js";


// ============================================================
// CREATE GAME
// ============================================================

export const createGame = async (
  gameConfig = {}
) => {

  const gameRef =
    doc(
      collection(
        db,
        "games"
      )
    );


  const game = {

    ...gameConfig,

    id:
      gameRef.id,

    status:
      "created",

    createdAt:
      serverTimestamp(),

  };


  await setDoc(
    gameRef,
    game
  );


  return game;

};


// ============================================================
// START GAME
// ============================================================

export const startGame = async (
  gameId
) => {

  if (!gameId) {

    throw new Error(
      "Game ID is required."
    );

  }


  const storedUser =
    sessionStorage.getItem(
      "currentUser"
    );


  if (!storedUser) {

    throw new Error(
      "Please log in first."
    );

  }


  const user =
    JSON.parse(
      storedUser
    );


  /*
   * Create a session for THIS browser.
   *
   * This does not block other browsers.
   */

  const session =
    await startSession(
      user,
      gameId
    );


  if (
    !session.success
  ) {

    throw new Error(
      session.message ||
      "Could not start game session."
    );

  }


  sessionStorage.setItem(
    "yatraSessionId",
    session.sessionId
  );


  // ==========================================================
  // GAME DOCUMENT
  // ==========================================================

  await setDoc(
    doc(
      db,
      "games",
      gameId
    ),
    {

      id:
        gameId,

      status:
        "active",

      startedAt:
        serverTimestamp(),

      lastStartedBy:
        user.uid,

      lastSessionId:
        session.sessionId,

    },
    {
      merge:
        true,
    }
  );


  return {

    id:
      gameId,

    status:
      "active",

    sessionId:
      session.sessionId,

  };

};


// ============================================================
// END GAME
// ============================================================

export const endGame = async (
  gameId
) => {

  if (!gameId) {

    throw new Error(
      "Game ID is required."
    );

  }


  const storedUser =
    sessionStorage.getItem(
      "currentUser"
    );


  if (storedUser) {

    const user =
      JSON.parse(
        storedUser
      );


    const sessionId =
      sessionStorage.getItem(
        "yatraSessionId"
      );


    if (
      sessionId
    ) {

      await endSession(
        user,
        sessionId
      );

    }

  }


  await setDoc(
    doc(
      db,
      "games",
      gameId
    ),
    {

      status:
        "completed",

      endedAt:
        serverTimestamp(),

    },
    {
      merge:
        true,
    }
  );


  sessionStorage.removeItem(
    "yatraSessionId"
  );


  return {

    id:
      gameId,

    status:
      "completed",

  };

};


// ============================================================
// GET GAME
// ============================================================

export const getGame = async (
  gameId
) => {

  if (!gameId) {

    throw new Error(
      "Game ID is required."
    );

  }


  const snapshot =
    await getDoc(
      doc(
        db,
        "games",
        gameId
      )
    );


  if (
    !snapshot.exists()
  ) {

    return null;

  }


  return {

    id:
      snapshot.id,

    ...snapshot.data(),

  };

};


// ============================================================
// UPDATE GAME
// ============================================================

export const updateGame = async (
  gameId,
  updates
) => {

  if (!gameId) {

    throw new Error(
      "Game ID is required."
    );

  }


  await updateDoc(
    doc(
      db,
      "games",
      gameId
    ),
    updates
  );


  return {

    id:
      gameId,

    ...updates,

  };

};


// ============================================================
// RECORD GAME ACTIVITY
// ============================================================

export const recordGameActivity =
  async () => {

    const storedUser =
      sessionStorage.getItem(
        "currentUser"
      );


    const sessionId =
      sessionStorage.getItem(
        "yatraSessionId"
      );


    if (
      !storedUser ||
      !sessionId
    ) {

      return false;

    }


    const user =
      JSON.parse(
        storedUser
      );


    return recordActivity(
      user,
      sessionId
    );

  };