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
import { createPlayer as member2CreatePlayer, STARTING_MUDRAS } from "../lib/gameLogic.ts";

export { STARTING_MUDRAS };

// ============================================================
// ADD PLAYER (Integrated with Firebase & Member 2 Game Logic)
// ============================================================
export const addPlayer = async (player) => {
  if (!player) {
    throw new Error("Player data is required.");
  }

  // Initialize with Member 2 game logic (STARTING_MUDRAS = 8000)
  const mudrasPlayer = member2CreatePlayer(
    player.uid || `CHB_${Date.now()}`,
    typeof player.age === "number" ? player.age : 20
  );

  const playerData = {
    name: player.name || "Player",
    uid: mudrasPlayer.uid,
    age: mudrasPlayer.age,
    mudras: mudrasPlayer.mudras,
    points: mudrasPlayer.mudras,
    color: player.color || "#355E3B",
    pawnIndex: player.pawnIndex ?? 0,
    gameId: player.gameId || "chowkabara_live_session",
    ...player,
  };

  try {
    const playerRef = await addDoc(collection(db, "players"), {
      ...playerData,
      createdAt: serverTimestamp(),
    });
    return {
      id: playerRef.id,
      ...playerData,
    };
  } catch (err) {
    console.warn("[Player Service] Firestore unavailable, using local session player:", err);
    return {
      id: player.id || "p_" + Date.now(),
      ...playerData,
    };
  }
};

// ============================================================
// REMOVE PLAYER
// ============================================================
export const removePlayer = async (playerId) => {
  if (!playerId) {
    throw new Error("Player ID is required.");
  }

  try {
    await deleteDoc(doc(db, "players", playerId));
  } catch (err) {
    console.warn("[Player Service] Firestore delete failed, continuing locally:", err);
  }
  return true;
};

// ============================================================
// UPDATE PLAYER
// ============================================================
export const updatePlayer = async (playerId, updates) => {
  if (!playerId) {
    throw new Error("Player ID is required.");
  }

  try {
    await updateDoc(doc(db, "players", playerId), updates);
  } catch (err) {
    console.warn("[Player Service] Firestore update failed, continuing locally:", err);
  }

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

  try {
    const playersQuery = query(
      collection(db, "players"),
      where("gameId", "==", gameId)
    );
    const snapshot = await getDocs(playersQuery);
    return snapshot.docs.map((playerDoc) => ({
      id: playerDoc.id,
      ...playerDoc.data(),
    }));
  } catch (err) {
    console.warn("[Player Service] Firestore fetch failed, returning empty list:", err);
    return [];
  }
};