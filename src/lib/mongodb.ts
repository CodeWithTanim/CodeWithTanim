import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB_NAME || 'cwt-portfolio';

if (!uri) {
  console.warn('Warning: MONGODB_URI environment variable is missing.');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const connectedClient = await clientPromise;
  const db = connectedClient.db(dbName);
  return { client: connectedClient, db };
}

export { clientPromise, dbName };
