import { Types } from "mongoose";


export interface IBaseRepository<T> {
  find(query: any): Promise<T[]>;
  create(entity: Partial<T>): Promise<T>;
  findById(id: Types.ObjectId): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: Types.ObjectId, entity: Partial<T>): Promise<T | null>;
  delete(id: Types.ObjectId): Promise<T | null>;
}