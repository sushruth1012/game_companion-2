// ============================================================
// YATRA ACTIVATION SERVICE
// ============================================================

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwY-XeVrowYic6_GCWtmxtPp-QvpKP7U1MvovUAIzp3LAvyADyNF8dxjv9ku2A6sbYo/exec";


// ============================================================
// CHECK EXISTING ACTIVATION
// ============================================================
//
// Checks whether this Google account has already activated Yatra.
//
// Parameters:
//   email   -> Google account email
//   googleId -> Google provider ID
//
// Returns the response from Apps Script.
// ============================================================

export const checkActivation = async (
  email,
  googleId
) => {

  try {

    if (!email) {

      throw new Error(
        "Google email is required."
      );

    }


    if (!googleId) {

      throw new Error(
        "Google ID is required."
      );

    }


    const url =
      `${APPS_SCRIPT_URL}` +
      `?action=checkUser` +
      `&email=${encodeURIComponent(email)}` +
      `&googleId=${encodeURIComponent(googleId)}`;


    console.log(
      "[Activation] Checking account activation..."
    );


    const response =
      await fetch(
        url
      );


    if (!response.ok) {

      throw new Error(
        `Activation server returned ${response.status}`
      );

    }


    const data =
      await response.json();


    console.log(
      "[Activation] Check result:",
      data
    );


    return data;

  } catch (error) {

    console.error(
      "[Activation] Activation check failed:",
      error
    );


    throw error;

  }

};


// ============================================================
// ACTIVATE / REDEEM CODE
// ============================================================
//
// Activates the Google account using the Yatra activation code.
//
// Parameters:
//   code  -> YATRA-XXXXXXXX-XXXX
//   email -> Google account email
//   googleId -> Google provider ID
//   name -> Google display name
//
// Returns the response from Apps Script.
// ============================================================

export const activateCode = async (
  code,
  email,
  googleId,
  name
) => {

  try {

    if (!code?.trim()) {

      throw new Error(
        "Please enter an activation code."
      );

    }


    if (!email) {

      throw new Error(
        "Google email is required."
      );

    }


    if (!googleId) {

      throw new Error(
        "Google ID is required."
      );

    }


    const cleanCode =
      code
        .trim()
        .toUpperCase();


    const url =
      `${APPS_SCRIPT_URL}` +
      `?action=activate` +
      `&code=${encodeURIComponent(cleanCode)}` +
      `&email=${encodeURIComponent(email)}` +
      `&googleId=${encodeURIComponent(googleId)}` +
      `&name=${encodeURIComponent(name || "")}`;


    console.log(
      "[Activation] Redeeming activation code..."
    );


    const response =
      await fetch(
        url
      );


    if (!response.ok) {

      throw new Error(
        `Activation server returned ${response.status}`
      );

    }


    const data =
      await response.json();


    console.log(
      "[Activation] Activation result:",
      data
    );


    return data;

  } catch (error) {

    console.error(
      "[Activation] Activation failed:",
      error
    );


    throw error;

  }

};


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  checkActivation,
  activateCode,
};