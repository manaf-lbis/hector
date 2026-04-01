import{ Types,QueryFilter } from "mongoose";


export interface IBaseRepository<T> {
  find(query: any): Promise<T[]>;
  findOne(query: QueryFilter<T>): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  findById(id: Types.ObjectId): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: Types.ObjectId, entity: Partial<T>): Promise<T | null>;
  upsert(query: QueryFilter<T>, data: Partial<T>): Promise<T>;
  delete(id: Types.ObjectId): Promise<T | null>;
  findOneAndUpdate(query: QueryFilter<T>, data: Partial<T>): Promise<T | null>;
  updateMany(query: QueryFilter<T>, data: Partial<T>): Promise<any>;
  deleteMany(query: QueryFilter<T>): Promise<any>;
}