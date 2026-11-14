import { getDatabase } from './mongodb';

export interface ActivityLog {
  action: string;
  details: string;
  ip?: string;
  location?: string;
  timestamp: Date;
}

export async function logActivity(
  action: string,
  details: string,
  ip: string = 'unknown',
  location: string = 'unknown'
) {
  try {
    const { db } = await getDatabase();
    await db.collection('activity_logs').insertOne({
      action,
      details,
      ip,
      location,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Failed to write activity log:', error);
  }
}
