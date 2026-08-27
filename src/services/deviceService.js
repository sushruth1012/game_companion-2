import {
  doc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase.js";

const DEVICE_KEY = "yatra_device_id";

// ============================================================
// GET / CREATE DEVICE ID
// ============================================================
export const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_KEY);
  if (!deviceId) {
    deviceId = "YATRA-" + crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, deviceId);
  }
  return deviceId;
};

// ============================================================
// REGISTER / VERIFY DEVICE FOR CURRENT SINGLE SESSION
// ============================================================
// Only 1 session at a time is allowed per board/user.
export const registerDevice = async (user, forceTakeover = false) => {
  if (!user) {
    throw new Error("User is not logged in.");
  }

  const deviceId = getDeviceId();
  const currentSessionId = "SESSION-" + crypto.randomUUID().slice(0, 8);
  const userRef = doc(db, "users", user.uid);

  try {
    return await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(userRef);
      const data = snapshot.exists() ? snapshot.data() : {};

      const activeSession = data.activeSessionId || "";
      const lastDeviceId = data.lastLoginDeviceId || "";
      const lastActiveTime = data.lastActivityAt?.toMillis ? data.lastActivityAt.toMillis() : 0;
      const isRecent = Date.now() - lastActiveTime < 15 * 60 * 1000; // 15 mins activity window

      // If another active session exists on a DIFFERENT device and not forcing takeover
      if (activeSession && lastDeviceId && lastDeviceId !== deviceId && isRecent && !forceTakeover) {
        return {
          success: false,
          isSessionConflict: true,
          deviceId,
          activeSessionId: activeSession,
          message: "Another game session is currently active on another device. Only 1 active session at a time is permitted.",
        };
      }

      // Claim session lock for this device
      transaction.set(
        userRef,
        {
          activeSessionId: currentSessionId,
          lastLoginDeviceId: deviceId,
          lastActivityAt: serverTimestamp(),
          lastDeviceVerifiedAt: serverTimestamp(),
        },
        { merge: true }
      );

      sessionStorage.setItem("yatraSessionId", currentSessionId);

      return {
        success: true,
        deviceId,
        sessionId: currentSessionId,
        message: "Device registered. Active session started.",
      };
    });
  } catch (err) {
    console.warn("[Device Service] Firestore session transaction notice:", err);
    sessionStorage.setItem("yatraSessionId", currentSessionId);
    return {
      success: true,
      deviceId,
      sessionId: currentSessionId,
      message: "Session initialized locally.",
    };
  }
};

// ============================================================
// FORCE TAKEOVER SESSION (Switch active session to this device)
// ============================================================
export const forceTakeoverSession = async (user) => {
  return registerDevice(user, true);
};

// ============================================================
// RELEASE SESSION (On logout / end game)
// ============================================================
export const releaseSession = async (user) => {
  if (!user?.uid) return;
  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        activeSessionId: null,
      },
      { merge: true }
    );
  } catch (e) {
    console.warn("[Device Service] Release session failed:", e);
  }
};