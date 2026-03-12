import { Model, Document, Types, QueryFilter } from "mongoose";
import { IBaseRepository } from "./interface/base.repository.interface";


export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  private readonly _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  async find(query: any): Promise<T[]> {
    return await this._model.find(query).exec();
  }

  async create(item: Partial<T>): Promise<T> {
    const newItem = new this._model(item);
    return await newItem.save();
  }

  async findById(id: Types.ObjectId): Promise<T | null> {
    return await this._model.findById(id).exec();
  }

  async findAll(): Promise<T[]> {
    return await this._model.find().exec();
  }

  async update(id: Types.ObjectId, item: Partial<T>): Promise<T | null> {
    return await this._model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  async upsert(query: QueryFilter<T>, data: Partial<T>): Promise<T> {
    return await this._model.findOneAndUpdate(
      query,
      data,
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true
      }
    );
  }

  async delete(id: Types.ObjectId): Promise<T | null> {
    return await this._model.findByIdAndDelete(id).exec();
  }

  async findOne(query: QueryFilter<T>): Promise<T | null> {
    return await this._model.findOne(query as any).exec();
  }

  async findOneAndUpdate(query: QueryFilter<T>, data: Partial<T>): Promise<T | null> {
    return await this._model.findOneAndUpdate(
      query,
      data,
      { returnDocument: "after" }
    ).exec();
  }



}
