export interface TelegramNotificationPayload {
  name: string;
  email: string;
  message: string;
  ip?: string;
  location?: string;
}

export async function getTelegramConfig() {
  let token = process.env.TELEGRAM_BOT_TOKEN || '';
  let chatId = process.env.TELEGRAM_CHAT_ID || '';

  // Fallback to MongoDB settings collection if not in environment
  if (!token || !chatId) {
    try {
      const { getDatabase } = await import('@/lib/mongodb');
      const { db } = await getDatabase();
      const config = await db.collection('settings').findOne({ key: 'telegram_config' });
      if (config) {
        token = token || config.botToken || '';
        chatId = chatId || config.chatId || '';
      }
    } catch {}
  }

  return {
    token,
    chatId,
    configured: Boolean(token && chatId),
  };
}

export async function sendTelegramNotification(
  payload: TelegramNotificationPayload
): Promise<boolean> {
  const { token, chatId, configured } = await getTelegramConfig();

  if (!configured) {
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

  const isCourse =
    payload.message.includes('[COURSE ENROLLMENT') ||
    payload.message.toLowerCase().includes('python') ||
    payload.message.includes('Payment Method:');

  let text = '';
  if (isCourse) {
    text =
      `🎓 <b>NEW PYTHON COURSE APPLICATION!</b>\n\n` +
      `👤 <b>Student:</b> ${escapedName}\n` +
      `📧 <b>Email:</b> ${escapedEmail}\n` +
      `📍 <b>Location:</b> ${locationStr}\n` +
      `🌐 <b>IP:</b> <code>${ipStr}</code>\n\n` +
      `📋 <b>Application Info:</b>\n<i>${escapedMessage}</i>\n\n` +
      `⏰ <i>${timeStr}</i>`;
  } else {
    text =
      `📬 <b>NEW PORTFOLIO CONTACT INQUIRY!</b>\n\n` +
      `👤 <b>Sender:</b> ${escapedName}\n` +
      `📧 <b>Email:</b> ${escapedEmail}\n` +
      `📍 <b>Location:</b> ${locationStr}\n` +
      `🌐 <b>IP:</b> <code>${ipStr}</code>\n\n` +
      `💬 <b>Message:</b>\n<i>${escapedMessage}</i>\n\n` +
      `⏰ <i>${timeStr}</i>`;
  }

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

export async function sendTestTelegramMessage(
  token: string,
  chatId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const timeStr = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const text =
      `⚡ <b>CodeWithTanim Portfolio - Telegram Alert Test</b>\n\n` +
      `✅ <b>Telegram Bot connection successful!</b>\n` +
      `From now on, whenever a visitor sends a contact message or enrolls in the Python Masterclass, you will receive real-time notifications right here.\n\n` +
      `⏰ <i>${timeStr}</i>`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    const data = await res.json();
    if (res.ok && data.ok) {
      return { success: true };
    }
    return {
      success: false,
      error: data.description || 'Failed to send message to Telegram',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: msg };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
