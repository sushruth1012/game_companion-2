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

const googleProvider =
  new GoogleAuthProvider();


// ============================================================
// GOOGLE LOGIN
// ============================================================

export const loginWithGoogle =
  async () => {

    try {

      const result =
        await signInWithPopup(
          auth,
          googleProvider
        );

      const user =
        result.user;


      const googleId =
        user.providerData?.find(
          (provider) =>
            provider.providerId ===
            "google.com"
        )?.uid || "";


      await setDoc(
        doc(
          db,
          "users",
          user.uid
        ),
        {
          uid:
            user.uid,

          name:
            user.displayName || "",

          email:
            user.email || "",

          photo:
            user.photoURL || "",

          googleId,

          lastLoginAt:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );


      const userData = {

        uid:
          user.uid,

        displayName:
          user.displayName || "",

        email:
          user.email || "",

        photoURL:
          user.photoURL || "",

        googleId,

      };


      sessionStorage.setItem(
        "currentUser",
        JSON.stringify(
          userData
        )
      );


      return userData;

    } catch (error) {

      console.error(
        "[Auth Service] Google login failed:",
        error
      );

      throw error;
    }
  };


// ============================================================
// LOGOUT
// ============================================================

export const logoutUser =
  async () => {

    try {

      await signOut(
        auth
      );


      sessionStorage.removeItem(
        "currentUser"
      );

      sessionStorage.removeItem(
        "currentGameSession"
      );

      sessionStorage.removeItem(
        "yatraSessionId"
      );


      return true;

    } catch (error) {

      console.error(
        "[Auth Service] Logout failed:",
        error
      );

      throw error;
    }
  };


// ============================================================
// CURRENT USER
// ============================================================

export const getCurrentUser =
  () => {

    const user =
      auth.currentUser;


    if (user) {

      return {

        uid:
          user.uid,

        displayName:
          user.displayName || "",

        email:
          user.email || "",

        photoURL:
          user.photoURL || "",

        googleId:
          user.providerData?.find(
            (provider) =>
              provider.providerId ===
              "google.com"
          )?.uid || "",

      };

    }


    const stored =
      sessionStorage.getItem(
        "currentUser"
      );


    return stored
      ? JSON.parse(stored)
      : null;
  };


// ============================================================
// JOIN GAME
// ============================================================

export const joinGame =
  async (
    gameCode
  ) => {

    if (
      !gameCode?.trim()
    ) {

      throw new Error(
        "Please enter a valid game code."
      );

    }


    const session = {

      gameCode:
        gameCode
          .trim()
          .toUpperCase(),

      joinedAt:
        new Date()
          .toISOString(),

    };


    sessionStorage.setItem(
      "currentGameSession",
      JSON.stringify(
        session
      )
    );


    return session;

  };