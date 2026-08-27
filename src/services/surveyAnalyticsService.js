/**
 * Survey & Move Telemetry Service
 * Records time taken by each player for each move with complete timestamps
 * Grouped cleanly by Player with total time and recording date.
 */

const LOCAL_STORAGE_KEY = 'chowkabara_survey_move_telemetry';
const WEBHOOK_STORAGE_KEY = 'chowkabara_google_sheets_webhook_url';

let googleSheetsWebhookUrl = localStorage.getItem(WEBHOOK_STORAGE_KEY) || '';

export const setGoogleSheetsWebhook = (url) => {
  googleSheetsWebhookUrl = url.trim();
  localStorage.setItem(WEBHOOK_STORAGE_KEY, googleSheetsWebhookUrl);
  return googleSheetsWebhookUrl;
};

export const getGoogleSheetsWebhook = () => {
  return localStorage.getItem(WEBHOOK_STORAGE_KEY) || googleSheetsWebhookUrl;
};

export const getAllSurveyRecords = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading survey telemetry records:', e);
    return [];
  }
};

/**
 * Record a completed move timestamp
 */
export const recordMoveTelemetry = async ({
  sessionId = 'chowkabara_live_session',
  moveNumber = 1,
  playerUid = '',
  playerName = '',
  heroTitle = '',
  heroName = '',
  startTime = Date.now(),
  endTime = Date.now(),
  actionType = 'Manual Pass',
  mudras = 0,
}) => {
  const durationMs = Math.max(0, endTime - startTime);
  const durationSeconds = Number((durationMs / 1000).toFixed(2));

  const record = {
    id: `move_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sessionId,
    moveNumber,
    playerUid,
    playerName,
    heroTitle,
    heroName,
    startIsoTime: new Date(startTime).toISOString(),
    startFormatted: new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    endIsoTime: new Date(endTime).toISOString(),
    endFormatted: new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    durationSeconds,
    durationFormatted: `${durationSeconds}s`,
    actionType,
    mudras,
    recordedAt: new Date().toLocaleString(),
    timestampIso: new Date().toISOString(),
  };

  try {
    const existing = getAllSurveyRecords();
    existing.push(record);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to store survey telemetry locally:', err);
  }

  // Webhook sync if configured
  const webhookUrl = getGoogleSheetsWebhook();
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
    } catch (webhookErr) {
      console.warn('[Survey Telemetry] Webhook delivery note:', webhookErr);
    }
  }

  return record;
};

/**
 * Groups all telemetry records cleanly by Player with total time and timestamps
 */
export const getPlayerGroupedSurveyData = (registeredPlayers = []) => {
  const records = getAllSurveyRecords();
  const grouped = {};

  // Pre-seed all registered players
  registeredPlayers.forEach((p, idx) => {
    grouped[p.name] = {
      playerIndex: idx + 1,
      name: p.name,
      uid: p.uid,
      heroName: p.heroName || '',
      heroTitle: p.heroSecondaryTitle || '',
      moves: [],
      totalSeconds: 0,
      totalMoves: 0,
      averageSeconds: 0,
    };
  });

  // Populate moves
  records.forEach((r) => {
    if (!grouped[r.playerName]) {
      grouped[r.playerName] = {
        playerIndex: Object.keys(grouped).length + 1,
        name: r.playerName,
        uid: r.playerUid,
        heroName: r.heroName || '',
        heroTitle: r.heroTitle || '',
        moves: [],
        totalSeconds: 0,
        totalMoves: 0,
        averageSeconds: 0,
      };
    }

    grouped[r.playerName].moves.push(r);
    grouped[r.playerName].totalSeconds += r.durationSeconds || 0;
    grouped[r.playerName].totalMoves += 1;
  });

  // Calculate averages
  Object.values(grouped).forEach((p) => {
    p.totalSeconds = Number(p.totalSeconds.toFixed(1));
    p.averageSeconds = p.totalMoves > 0 ? Number((p.totalSeconds / p.totalMoves).toFixed(1)) : 0;
  });

  return Object.values(grouped);
};

/**
 * Generates the clean CSV format requested by the user:
 * Player 1 (Name) - all timestamps, total time
 * Player 2 ...
 * Date of recording at the end
 */
export const generateSurveyCSV = (registeredPlayers = []) => {
  const groupedPlayers = getPlayerGroupedSurveyData(registeredPlayers);
  if (groupedPlayers.length === 0) return '';

  const lines = [];

  // Header Banner
  lines.push('CHOWKABARA GAME MOVE SURVEY ANALYSIS');
  lines.push('');

  groupedPlayers.forEach((player) => {
    lines.push(`========================================================================`);
    lines.push(`PLAYER ${player.playerIndex}: ${player.name} (UID: ${player.uid} | Hero: ${player.heroTitle || player.heroName || 'N/A'})`);
    lines.push(`Move #,Turn Start Time,Turn End Time,Time Taken (Seconds),Action`);

    if (player.moves.length === 0) {
      lines.push(`No moves recorded yet for this player`);
    } else {
      player.moves.forEach((m, idx) => {
        lines.push(`${idx + 1},"${m.startFormatted}","${m.endFormatted}",${m.durationSeconds}s,"${m.actionType}"`);
      });
    }

    lines.push(`TOTAL TIME TAKEN,${player.totalSeconds}s,AVERAGE PER MOVE,${player.averageSeconds}s,TOTAL MOVES,${player.totalMoves}`);
    lines.push('');
  });

  // Date of Recording at the very end
  lines.push(`========================================================================`);
  const recordingDate = new Date().toLocaleString();
  lines.push(`DATE OF RECORDING:,"${recordingDate}"`);

  return lines.join('\n');
};

/**
 * Generate clean copyable plain-text summary
 */
export const generateSurveyTextSummary = (registeredPlayers = []) => {
  const groupedPlayers = getPlayerGroupedSurveyData(registeredPlayers);
  const recordingDate = new Date().toLocaleString();

  let text = `📊 CHOWKABARA SURVEY MOVE ANALYSIS\n\n`;

  groupedPlayers.forEach((p) => {
    text += `👤 PLAYER ${p.playerIndex}: ${p.name} (UID: ${p.uid} | Hero: ${p.heroTitle || 'N/A'})\n`;
    if (p.moves.length === 0) {
      text += `   - No moves recorded yet\n`;
    } else {
      p.moves.forEach((m, i) => {
        text += `   • Move ${i + 1}: ${m.durationSeconds}s (${m.startFormatted} → ${m.endFormatted}) [${m.actionType}]\n`;
      });
    }
    text += `   ⏱️ TOTAL TIME: ${p.totalSeconds}s (Avg: ${p.averageSeconds}s/move across ${p.totalMoves} moves)\n\n`;
  });

  text += `📅 DATE OF RECORDING: ${recordingDate}\n`;
  return text;
};

/**
 * Trigger download of Survey Move Telemetry CSV for Google Sheets
 */
export const downloadSurveyCSV = (registeredPlayers = [], filename = `chowkabara_survey_${Date.now()}.csv`) => {
  const csvContent = generateSurveyCSV(registeredPlayers);
  if (!csvContent) {
    alert('No move telemetry recorded yet.');
    return false;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};

export const openGoogleSheets = () => {
  window.open('https://sheets.new', '_blank');
};

export const clearSurveyRecords = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  return [];
};
