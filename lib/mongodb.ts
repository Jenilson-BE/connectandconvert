import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/connectandconvert";
const options = {
  serverSelectionTimeoutMS: 2000,
  connectTimeoutMS: 3000,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!uri) {
    return null;
  }

  try {
    if (process.env.NODE_ENV === "development") {
      // In development mode, use a global variable so the client is preserved across module reloads
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
      }
      return await global._mongoClientPromise;
    } else {
      if (!clientPromise) {
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
      }
      return await clientPromise;
    }
  } catch (err) {
    console.warn("MongoDB connection warning (falling back to file storage):", err);
    return null;
  }
}

export async function getDb(): Promise<Db | null> {
  try {
    const connectedClient = await getMongoClient();
    if (!connectedClient) return null;
    return connectedClient.db();
  } catch (err) {
    console.warn("MongoDB getDb warning:", err);
    return null;
  }
}

export async function isMongoConnected(): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    await db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}
