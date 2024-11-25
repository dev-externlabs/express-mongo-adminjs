/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @typedef {Object} QueryResult
 * @property {Document[]} results - Results found
 * @property {number} page - Current page
 * @property {number} limit - Maximum number of results per page
 * @property {number} totalPages - Total number of pages
 * @property {number} totalResults - Total number of documents
 */

// import { populate } from "dotenv";
import { Schema } from "mongoose";

/**
 * A mongoose schema plugin that adds pagination functionality.
 * @param {mongoose.Schema} schema - The Mongoose schema to apply the plugin to.
 */
const paginate = (schema: Schema<any, any, any, any, any>) => {
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filter, options: {sortBy?:string, limit?:string, page?:string, populate?:string, projection:{[key:string]:number}}) {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = options.sortBy.split(',').map((sortOption: string) => {
        const [key, order] = sortOption.split(':');
        return (order === 'desc' ? '-' : '') + key;
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter, options.projection).sort(sort).skip(skip).limit(limit);

    // if (options.populate) {
    //   options.populate.split(',').forEach((populateOption:string) => {
    //     docsPromise = docsPromise.populate(
    //       populateOption
    //         .split('.')
    //         .reverse()
    //         .reduce(
    //           (a: { path: string; populate: { path: any; populate: any } | object }, b: string) => ({
    //             path: b,
    //             populate: a,
    //           }),
    //           { path: '', populate: {} }
    //         )
    //     );
    //   });
    // }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then(([totalResults, results]) => {
      const totalPages = Math.ceil(totalResults / limit);
      return {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
    });
  };
};

export default paginate;
