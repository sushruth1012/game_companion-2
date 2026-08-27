/**
 * Survey & Move Telemetry Service
 * Records time taken by individuals for each move with complete timestamps
 * for analysis and Google Sheets sync/export.
 */

const LOCAL_STORAGE_KEY = 'chowkabara_survey_move_telemetry';
const WEBHOOK_STORAGE_KEY = 'chowkabara_google_sheets_webhook_url';

// Default Google Apps Script / Webhook Endpoint (can be updated dynamically)
let googleSheetsWebhookUrl = localStorage.getItem(WEBHOOK_STORAGE_KEY) || '';

/**
 * Configure the Google Sheets Webhook URL
 * @param {string} url - Google Apps Script Web App URL or SheetDB endpoint
 */
export const setGoogleSheetsWebhook = (url) => {
  googleSheetsWebhookUrl = url.trim();
  localStorage.setItem(WEBHOOK_STORAGE_KEY, googleSheetsWebhookUrl);
  return googleSheetsWebhookUrl;
};

export const getGoogleSheetsWebhook = () => {
  return localStorage.getItem(WEBHOOK_STORAGE_KEY) || googleSheetsWebhookUrl;
};

/**
 * Get all recorded move records from storage
 * @returns {Array} List of move telemetry logs
 */
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
 * Record a completed move timestamp into local telemetry and sync to Google Sheets
 * @param {Object} moveData
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
    recordedAt: new Date().toISOString(),
  };

  // 1. Save locally in localStorage for persistent survey history
  try {
    const existing = getAllSurveyRecords();
    existing.push(record);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
    console.log(`[Survey Telemetry] Logged move #${moveNumber} for ${playerName}: ${durationSeconds}s (${actionType})`);
  } catch (err) {
    console.error('Failed to store survey telemetry locally:', err);
  }

  // 2. Post to Google Sheets webhook if configured
  const webhookUrl = getGoogleSheetsWebhook();
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors', // standard for Google Apps Script Webhooks
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      console.log('[Survey Telemetry] Synced move record to Google Sheets webhook');
    } catch (webhookErr) {
      console.warn('[Survey Telemetry] Webhook delivery notice (persisted in local cache):', webhookErr);
    }
  }

  return record;
};

/**
 * Generate CSV string formatted for direct Google Sheets / Excel import
 */
export const generateSurveyCSV = () => {
  const records = getAllSurveyRecords();
  if (records.length === 0) return '';

  const headers = [
    'Move Number',
    'Player Name',
    'Player UID',
    'Hero Name',
    'Hero Secondary Title',
    'Time Taken (Seconds)',
    'Turn Start Time',
    'Turn End Time',
    'Action Type',
    'Mudras Balance',
    'Session ID',
    'Date Recorded',
  ];

  const rows = records.map((r) => [
    r.moveNumber,
    `"${r.playerName.replace(/"/g, '""')}"`,
    `"${r.playerUid}"`,
    `"${r.heroName || ''}"`,
    `"${r.heroTitle || ''}"`,
    r.durationSeconds,
    `"${r.startFormatted} (${r.startIsoTime})"`,
    `"${r.endFormatted} (${r.endIsoTime})"`,
    `"${r.actionType}"`,
    r.mudras,
    `"${r.sessionId}"`,
    `"${r.recordedAt}"`,
  ]);

  return [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
};

/**
 * Trigger download of Survey Move Telemetry CSV for Google Sheets
 */
export const downloadSurveyCSV = (filename = `chowkabara_turn_survey_${Date.now()}.csv`) => {
  const csvContent = generateSurveyCSV();
  if (!csvContent) {
    alert('No move telemetry recorded yet. Play a few turns in Live Game first!');
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

/**
 * Open Google Sheets import URL
 */
export const openGoogleSheets = () => {
  window.open('https://sheets.new', '_blank');
};

/**
 * Clear all survey telemetry
 */
export const clearSurveyRecords = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  return [];
};
