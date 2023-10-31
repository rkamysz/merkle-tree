import { Query } from "./types";

/**
 * @abstract
 * @class
 * Represents a general interface for the data sources in the application.
 *
 * This abstract class should be implemented by concrete data source classes that interact with a specific type of database.
 */
export abstract class DataSource<DocumentType = unknown> {
  public collectionName: string;

  /**
   * Abstract method to find documents in the data source that match the provided query.
   *
   * @param {Query} [query] The search criteria.
   * @returns {Promise<DocumentType[]>} A promise that resolves to an array of documents.
   * @abstract
   */
  public abstract find(query?: Query): Promise<DocumentType[]>;

  /**
   * Abstract method to insert documents into the data source.
   *
   * @param {Query} query The documents to insert.
   * @returns {Promise<DocumentType[]>} A promise that resolves to the inserted documents.
   * @abstract
   */
  public abstract insert(query: Query): Promise<DocumentType[]>;

  /**
   * Abstract method to count documents in the data source that match the provided query.
   *
   * @param {Query} [query] The search criteria.
   * @returns {Promise<number>} A promise that resolves to the count of documents.
   * @abstract
   */
  public abstract count(query?: Query): Promise<number>;
}
