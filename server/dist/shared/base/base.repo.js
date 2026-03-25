"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this._model = model;
    }
    async find(query) {
        return await this._model.find(query).exec();
    }
    async create(item) {
        const newItem = new this._model(item);
        return await newItem.save();
    }
    async findById(id) {
        return await this._model.findById(id).exec();
    }
    async findAll() {
        return await this._model.find().exec();
    }
    async update(id, item) {
        return await this._model.findByIdAndUpdate(id, item, { new: true }).exec();
    }
    async upsert(query, data) {
        return await this._model.findOneAndUpdate(query, data, {
            upsert: true,
            returnDocument: "after",
            setDefaultsOnInsert: true
        });
    }
    async delete(id) {
        return await this._model.findByIdAndDelete(id).exec();
    }
    async findOne(query) {
        return await this._model.findOne(query).exec();
    }
    async findOneAndUpdate(query, data) {
        return await this._model.findOneAndUpdate(query, data, { returnDocument: "after" }).exec();
    }
}
exports.BaseRepository = BaseRepository;
