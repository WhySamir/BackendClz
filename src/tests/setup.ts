import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
jest.setTimeout(60000);
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'test',
    },
    
  });

  const mongoUri = mongoServer.getUri();
   process.env.MONGO_URI = mongoUri;
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});


afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});