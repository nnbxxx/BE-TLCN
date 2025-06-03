import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { OpenAIEmbeddings } from '@langchain/openai';
import { cosineSimilarity } from 'src/util/cosine';

@Injectable()
export class VectorStoreService {
  private client = new MongoClient(process.env.MONGODB_URI);
  private dbName = 'test';
  private collectionName = 'vectors';
  private embeddings = new OpenAIEmbeddings();

  async saveVector(text: string, source: string, vector: number[]) {
    const db = this.client.db(this.dbName);
    const collection = db.collection(this.collectionName);
    await collection.insertOne({ text, source, vector });
  }

  async searchRelevantContent(query: string, topK = 3) {
    const db = this.client.db(this.dbName);
    const collection = db.collection(this.collectionName);

    // Tính embedding của câu query
    const queryVector = await this.embeddings.embedQuery(query);

    // Lấy tất cả document trong DB (có embedding vector)
    const allDocs = await collection.find().toArray();

    // Tính cosine similarity, lọc, sắp xếp, lấy topK
    const scored = allDocs
      .map(doc => ({
        ...doc,
        score: cosineSimilarity(queryVector, doc.embedding),
      }))
      .filter(d => d.score > 0.90)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored;
  }

  async clearAll() {
    const db = this.client.db(this.dbName);
    await db.collection(this.collectionName).deleteMany({});
  }
}
