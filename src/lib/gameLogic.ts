export type Difficulty = "easy" | "medium" | "hard";

export interface Player {
  uid: string;
  age: number;
  mudras: number;
}

export interface Riddle {
  id: string;
  difficulty: Difficulty;
  question: string;
}

export interface Advantage {
  id: string;
  name: string;
  description: string;
}

export interface PurchaseResult {
  success: boolean;
  player: Player;
  riddle?: Riddle;
  message: string;
}

export const STARTING_MUDRAS = 9000;

export const RIDDLE_COSTS: Record<Difficulty, number> = {
  easy: 500,
  medium: 1000,
  hard: 1500,
};

/**
 * Create a new player with the starting amount of Mudras.
 */
export function createPlayer(uid: string, age: number): Player {
  return {
    uid,
    age,
    mudras: STARTING_MUDRAS,
  };
}

/**
 * Buy a riddle.
 *
 * The app does NOT decide when a player may buy.
 * Players can purchase a riddle whenever they choose.
 *
 * There is no turn restriction here.
 * A player may purchase multiple riddles during one game,
 * as long as they have enough Mudras.
 */
export function buyRiddle(
  player: Player,
  riddle: Riddle,
): PurchaseResult {
  const cost = RIDDLE_COSTS[riddle.difficulty];

  if (player.mudras < cost) {
    return {
      success: false,
      player,
      message: `Not enough Mudras. You need ${cost} Mudras.`,
    };
  }

  const updatedPlayer: Player = {
    ...player,
    mudras: player.mudras - cost,
  };

  return {
    success: true,
    player: updatedPlayer,
    riddle,
    message: `${cost} Mudras spent. Riddle purchased.`,
  };
}

/**
 * Get a random riddle from a collection of riddles.
 *
 * Returns undefined if no riddles are available.
 */
export function getRandomRiddle(
  riddles: Riddle[],
): Riddle | undefined {
  if (riddles.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * riddles.length);

  return riddles[randomIndex];
}

/**
 * Validate whether a submitted riddle answer was successful.
 *
 * The Developer Guide specifies this function as part of the
 * agreed game-logic API, but does not specify how riddle answers
 * are stored or compared yet.
 *
 * For now, the result is supplied by the game/player flow.
 * The actual answer-validation mechanism can be connected later.
 */
export function validateAnswer(solved: boolean): boolean {
  return solved;
}

/**
 * Submit the result of a purchased riddle.
 *
 * If the riddle is not solved:
 * - The Mudras were already spent when the riddle was purchased.
 * - No Mudras are refunded.
 *
 * If the riddle is solved:
 * - The player receives the supplied advantage.
 */
export function submitAnswer(
  player: Player,
  solved: boolean,
  advantage?: Advantage,
) {
  const isCorrect = validateAnswer(solved);

  if (!isCorrect) {
    return {
      player,
      solved: false,
      advantage: undefined,
      message: "Riddle not solved. Purchase is lost.",
    };
  }

  return {
    player,
    solved: true,
    advantage,
    message: advantage
      ? `Riddle solved! Advantage earned: ${advantage.name}`
      : "Riddle solved!",
  };
}
