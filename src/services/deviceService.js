import {
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../lib/firebase";


// ============================================================
// LOCAL DEVICE ID
// ============================================================

const DEVICE_KEY =
  "yatra_device_id";


// ============================================================
// GET / CREATE DEVICE ID
// ============================================================

export const getDeviceId = () => {

  let deviceId =
    localStorage.getItem(
      DEVICE_KEY
    );


  if (!deviceId) {

    deviceId =
      "YATRA-" +
      crypto.randomUUID();


    localStorage.setItem(
      DEVICE_KEY,
      deviceId
    );
  }


  return deviceId;
};


// ============================================================
// REGISTER / VERIFY DEVICE FOR CURRENT SESSION
// ============================================================
//
// Device identity is now associated with the CURRENT SESSION,
// not permanently with the Google account.
//
// This allows:
// Browser A → Sign Out → Browser B → Login
//
// ============================================================

export const registerDevice = async (
  user
) => {

  if (!user) {

    throw new Error(
      "User is not logged in."
    );
  }


  const deviceId =
    getDeviceId();


  const userRef =
    doc(
      db,
      "users",
      user.uid
    );


  return runTransaction(
    db,
    async (transaction) => {

      const snapshot =
        await transaction.get(
          userRef
        );


      const data =
        snapshot.exists()
          ? snapshot.data()
          : {};


      // --------------------------------------------------------
      // If another active session exists, DO NOT allow this
      // browser to take it over.
      // --------------------------------------------------------

      const activeSession =
        data.activeSessionId || "";


      if (activeSession) {

        return {

          success: false,

          deviceId,

          message:
            "Another Yatra game session is active. Please close it to continue.",

          sessionId:
            activeSession,
        };
      }


      // --------------------------------------------------------
      // No active session.
      //
      // This browser can now be used.
      // --------------------------------------------------------

      transaction.set(
        userRef,
        {
          lastLoginDeviceId:
            deviceId,

          lastDeviceVerifiedAt:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );


      return {

        success: true,

        deviceId,

        message:
          "Device ready for Yatra session.",
      };
    }
  );
};