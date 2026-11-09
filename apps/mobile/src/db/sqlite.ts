import * as SQLite from 'expo-sqlite';
import { Log } from '@poop-pee-log/shared';

const DB_NAME = 'pooppeelog.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    await initDatabase(dbInstance);
  }
  return dbInstance;
}

async function initDatabase(db: SQLite.SQLiteDatabase) {
  // Aktifkan mode WAL untuk performa baca/tulis kilat (<10ms)
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS local_logs (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      altitude REAL,
      city TEXT NOT NULL,
      district TEXT NOT NULL,
      subdistrict TEXT,
      country TEXT NOT NULL DEFAULT 'Indonesia',
      mood TEXT,
      note TEXT,
      logged_at TEXT NOT NULL,
      is_blurred INTEGER NOT NULL DEFAULT 0,
      blurred_latitude REAL,
      blurred_longitude REAL,
      client_created_at TEXT NOT NULL,
      sync_status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_logs_logged_at ON local_logs(logged_at DESC);
    CREATE INDEX IF NOT EXISTS idx_logs_sync_status ON local_logs(sync_status);

    CREATE TABLE IF NOT EXISTS user_preferences (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}

export async function insertLocalLog(log: Log): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO local_logs (
      id, user_id, type, latitude, longitude, altitude,
      city, district, subdistrict, country, mood, note,
      logged_at, is_blurred, blurred_latitude, blurred_longitude,
      client_created_at, sync_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      log.id,
      log.userId,
      log.type,
      log.latitude,
      log.longitude,
      log.altitude ?? null,
      log.city,
      log.district,
      log.subdistrict ?? null,
      log.country || 'Indonesia',
      log.mood ?? null,
      log.note ?? null,
      log.loggedAt,
      log.isBlurred ? 1 : 0,
      log.blurredLatitude ?? null,
      log.blurredLongitude ?? null,
      log.clientCreatedAt,
      log.syncStatus || 'pending',
    ]
  );
}

export async function getLocalLogs(limit = 100): Promise<Log[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM local_logs ORDER BY logged_at DESC LIMIT ?`,
    [limit]
  );

  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    type: r.type,
    latitude: r.latitude,
    longitude: r.longitude,
    altitude: r.altitude ?? undefined,
    city: r.city,
    district: r.district,
    subdistrict: r.subdistrict ?? undefined,
    country: r.country,
    mood: r.mood ?? undefined,
    note: r.note ?? undefined,
    loggedAt: r.logged_at,
    isBlurred: Boolean(r.is_blurred),
    blurredLatitude: r.blurred_latitude ?? undefined,
    blurredLongitude: r.blurred_longitude ?? undefined,
    clientCreatedAt: r.client_created_at,
    syncStatus: r.sync_status,
  }));
}

export async function deleteLocalLog(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM local_logs WHERE id = ?`, [id]);
}

export async function clearAllLocalData(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    DELETE FROM local_logs;
    DELETE FROM user_preferences;
  `);
}
