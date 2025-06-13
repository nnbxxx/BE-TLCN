import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { OpenAIEmbeddings } from '@langchain/openai';
import { cosineSimilarity } from 'src/util/cosine';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import pdfParse from "pdf-parse";
import { VectorDocument } from './schemas/vector-store.schema';
import { Document } from './schemas/document.schema';
@Injectable()
export class VectorStoreService {
  private embeddings = new OpenAIEmbeddings();
  constructor(
    @InjectModel(VectorDocument.name)
    private vectorModel: Model<VectorDocument>,
    @InjectModel(Document.name)
    private documentModel: Model<Document>,
  ) {

  }

  async processPDFAndStoreVector(buffer, filename, title) {
    // 1. Chia văn bản thành các đoạn nhỏ

    const data = await pdfParse(buffer);
    const text = data.text.trim();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150,
    });
    const docs = await splitter.createDocuments([text]);
    const documentMetadata = {
      filename,
      title,
      chunkCount: docs.length,
      vectorIds: [],
    };



    for (const doc of docs) {
      const embedding = await this.embeddings.embedQuery(doc.pageContent);
      const vectorDoc = {
        content: doc.pageContent,
        embedding,
        metadata: { filename, title },
      };
      const result = await this.vectorModel.create(vectorDoc);
      documentMetadata.vectorIds.push(result.id.toString());
    }
    const newDoc = await this.documentModel.create(documentMetadata)
    return {
      newDoc
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
