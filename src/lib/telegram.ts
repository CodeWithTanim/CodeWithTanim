export interface TelegramNotificationPayload {
  name: string;
  email: string;
  message: string;
  ip?: string;
  location?: string;
}

export async function sendTelegramNotification(
  payload: TelegramNotificationPayload
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // Telegram is not configured yet; skip silently
    return false;
  }

  const escapedName = escapeHtml(payload.name);
  const escapedEmail = escapeHtml(payload.email);
  const escapedMessage = escapeHtml(payload.message);
  const locationStr = escapeHtml(payload.location || 'Unknown');
  const ipStr = escapeHtml(payload.ip || 'Unknown');
  const timeStr = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const text =
    `📬 <b>New Portfolio Message!</b>\n\n` +
    `👤 <b>Name:</b> ${escapedName}\n` +
    `📧 <b>Email:</b> ${escapedEmail}\n` +
    `📍 <b>Location:</b> ${locationStr}\n` +
    `🌐 <b>IP:</b> <code>${ipStr}</code>\n\n` +
    `💬 <b>Message:</b>\n<i>${escapedMessage}</i>\n\n` +
    `⏰ <i>${timeStr}</i>`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    return res.ok;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
