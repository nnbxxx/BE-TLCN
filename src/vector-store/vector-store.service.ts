import { Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import pdfParse from "pdf-parse";
import { VectorDocument } from './schemas/vector-store.schema';
import { Document } from './schemas/document.schema';
import { cosineSimilarity } from 'src/util/util';
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
  async searchSimilarDocuments(query: string, topK = 5) {
    // 1. Tính embedding cho truy vấn
    const queryEmbedding = await this.embeddings.embedQuery(query);

    // 2. Lấy tất cả vector đã lưu từ MongoDB
    const allVectors = await this.vectorModel.find();

    // 3. Tính cosine similarity giữa embedding của truy vấn và từng vector
    const similarities = allVectors.map(doc => {
      const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
      return { doc, similarity };
    });

    // 4. Sắp xếp theo độ tương đồng giảm dần và lấy top K kết quả
    const topResults = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    // 5. Trả về kết quả
    return topResults.map(result => ({
      content: result.doc.content,
      similarity: result.similarity,
      metadata: result.doc.metadata,
    }));
  }
}
