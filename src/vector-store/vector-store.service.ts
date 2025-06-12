import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { OpenAIEmbeddings } from '@langchain/openai';
import { cosineSimilarity } from 'src/util/cosine';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { InjectModel } from '@nestjs/mongoose';
import { Vector, VectorDocument } from './schemas/vector-store.schema';
import { Model } from 'mongoose';
@Injectable()
export class VectorStoreService {
  private embeddings = new OpenAIEmbeddings();
  constructor(
    @InjectModel(Vector.name)
    private vectorModel: Model<VectorDocument>,
  ) {

  }

  async saveTextAsChunksAndVectors(text: string, source: string) {
    // 1. Chia văn bản thành các đoạn nhỏ
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150,
    });

    const docs = await splitter.createDocuments([text]);
    const insertedIds: string[] = [];

    for (const doc of docs) {
      const embedding = await this.embeddings.embedQuery(doc.pageContent);

      const result = await this.vectorModel.create({
        text: doc.pageContent,
        source,
        embedding,
        createdAt: new Date(),
      });

      insertedIds.push(result._id.toString());
    }

    return {
      message: 'Saved chunks and vectors successfully',
      chunkCount: docs.length,
      insertedIds,
    };
  }

  async searchRelevantContent(query: string, topK = 3) {
    // const db = this.client.db(this.dbName);
    // const collection = db.collection(this.collectionName);

    // // Tính embedding của câu query
    // const queryVector = await this.embeddings.embedQuery(query);

    // // Lấy tất cả document trong DB (có embedding vector)
    // const allDocs = await collection.find().toArray();

    // // Tính cosine similarity, lọc, sắp xếp, lấy topK
    // const scored = allDocs
    //   .map(doc => ({
    //     ...doc,
    //     score: cosineSimilarity(queryVector, doc.embedding),
    //   }))
    //   .filter(d => d.score > 0.90)
    //   .sort((a, b) => b.score - a.score)
    //   .slice(0, topK);

    // return scored;
  }

  async clearAll() {
    // const db = this.client.db(this.dbName);
    // await db.collection(this.collectionName).deleteMany({});
  }
}
