import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../lib/firebase.js";


// ============================================================
// ADD PLAYER
// ============================================================

export const addPlayer = async (player) => {

  if (!player) {
    throw new Error("Player data is required.");
  }

  const playerRef =
    await addDoc(
      collection(db, "players"),
      {
        ...player,
        createdAt: serverTimestamp(),
      }
    );

  return {
    id: playerRef.id,
    ...player,
  };
};


// ============================================================
// REMOVE PLAYER
// ============================================================

export const removePlayer = async (playerId) => {

  if (!playerId) {
    throw new Error("Player ID is required.");
  }

  await deleteDoc(
    doc(db, "players", playerId)
  );

  return true;
};


// ============================================================
// UPDATE PLAYER
// ============================================================

export const updatePlayer = async (
  playerId,
  updates
) => {

  if (!playerId) {
    throw new Error("Player ID is required.");
  }

  await updateDoc(
    doc(db, "players", playerId),
    updates
  );

  return {
    id: playerId,
    ...updates,
  };
};


// ============================================================
// GET PLAYERS
// ============================================================

export const getPlayers = async (gameId) => {

  if (!gameId) {
    throw new Error("Game ID is required.");
  }

  const playersQuery =
    query(
      collection(db, "players"),
      where("gameId", "==", gameId)
    );

  const snapshot =
    await getDocs(playersQuery);

  return snapshot.docs.map(
    (playerDoc) => ({
      id: playerDoc.id,
      ...playerDoc.data(),
    })
  );
};