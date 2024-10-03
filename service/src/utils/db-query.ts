import { QueryOptions } from "@ebazdev/core";
import mongoose, { Model } from "mongoose";

const selectAndCountAll = async (
    criteria: any,
    model: Model<any>,
    options?: QueryOptions,
): Promise<{ data: mongoose.Document[]; total: number, totalPages: number, currentPage: number }> => {
    const columns = options && options.columns ? options.columns : "";
    const item = model.find(criteria, columns);
    if (options) {
        if (options.sortBy) {
            const sort: any = {};
            sort[options.sortBy] = options.sortDir || 1;
            item.sort(sort);
        }
        if (options.page) {
            item.skip((Number(options.page) - 1) * Number(options.limit || 0));
        } if (options.limit) {
            options.limit = Number(options.limit);
            item.limit(options.limit);
        }
    }
    const data = await item;
    const total = await model.countDocuments(criteria);
    let totalPages = Math.ceil(options && options.limit ? total / Number(options.limit) : 1);
    let currentPage = Number(options?.page || 1);
    return { data, total, totalPages, currentPage };
};

export { selectAndCountAll }