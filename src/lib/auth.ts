import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB_NAME || 'cwt-portfolio';

let client: MongoClient;
declare global {
  // eslint-disable-next-line no-var
  var _authMongoClient: MongoClient | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._authMongoClient) {
    global._authMongoClient = new MongoClient(uri);
  }
  client = global._authMongoClient;
} else {
  client = new MongoClient(uri);
}

const db = client.db(dbName);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-cwt-portfolio-2026',
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  trustedOrigins: [
    'https://codewithtanim.is-a.dev',
    'https://codewithtanim-official.vercel.app',
    'http://localhost:3000',
  ],
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
