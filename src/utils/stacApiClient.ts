import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  StacCollection,
  StacItem,
  StacItemCollection,
  StacCollectionList,
  StacSearchParams,
  StacApiError,
} from "../types/stac.js";
import { loadConfig } from "./config.js";
import { logger } from "./logger.js";

/**
 * Client for interacting with STAC API
 */
export class StacApiClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl?: string) {
    const config = loadConfig();
    this.baseUrl = baseUrl || config.stacApiUrl;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.stacApiTimeout,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    
    logger.debug("StacApiClient initialized", { baseUrl: this.baseUrl, timeout: config.stacApiTimeout });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Server responded with error status
          const stacError: StacApiError = {
            code: error.response.status.toString(),
            description: error.response.data?.detail || error.message,
          };
          logger.error("STAC API error response", stacError);
          throw new Error(`STAC API Error ${stacError.code}: ${stacError.description}`);
        } else if (error.request) {
          // Network error
          logger.error("Network error connecting to STAC API", { baseUrl: this.baseUrl });
          throw new Error(`Network error: Unable to connect to STAC API at ${this.baseUrl}`);
        } else {
          // Other error
          logger.error("Request error", { message: error.message });
          throw new Error(`Request error: ${error.message}`);
        }
      }
    );
  }

  /**
   * Search collections
   */
  async searchCollections(params: { limit?: number } = {}): Promise<StacCollection[]> {
    try {
      logger.debug("Searching collections", params);
      const response: AxiosResponse<StacCollectionList> = await this.client.get("/collections", {
        params: {
          limit: params.limit || 10,
        },
      });
      logger.debug("Collections search successful", { count: response.data.collections.length });
      return response.data.collections;
    } catch (error) {
      logger.error("Failed to search collections", { error: error instanceof Error ? error.message : error });
      throw new Error(`Failed to search collections: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Get a specific collection by ID
   */
  async getCollection(collectionId: string): Promise<StacCollection> {
    try {
      const response: AxiosResponse<StacCollection> = await this.client.get(
        `/collections/${encodeURIComponent(collectionId)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get collection ${collectionId}: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Search items
   */
  async searchItems(params: StacSearchParams = {}): Promise<StacItemCollection> {
    try {
      const searchBody: any = {};

      if (params.collections) searchBody.collections = params.collections;
      if (params.bbox) searchBody.bbox = params.bbox;
      if (params.datetime) searchBody.datetime = params.datetime;
      if (params.query) searchBody.query = params.query;
      if (params.filter) searchBody.filter = params.filter;
      if (params.sortby) searchBody.sortby = params.sortby;
      if (params.fields) searchBody.fields = params.fields;
      if (params.limit) searchBody.limit = params.limit;
      if (params.token) searchBody.token = params.token;

      const response: AxiosResponse<StacItemCollection> = await this.client.post("/search", searchBody);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search items: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Get items from a specific collection
   */
  async getCollectionItems(
    collectionId: string,
    params: { limit?: number; bbox?: [number, number, number, number]; datetime?: string } = {}
  ): Promise<StacItemCollection> {
    try {
      const response: AxiosResponse<StacItemCollection> = await this.client.get(
        `/collections/${encodeURIComponent(collectionId)}/items`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to get items from collection ${collectionId}: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  /**
   * Get a specific item
   */
  async getItem(collectionId: string, itemId: string): Promise<StacItem> {
    try {
      const response: AxiosResponse<StacItem> = await this.client.get(
        `/collections/${encodeURIComponent(collectionId)}/items/${encodeURIComponent(itemId)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to get item ${itemId} from collection ${collectionId}: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  /**
   * Create a new collection
   */
  async createCollection(collection: StacCollection): Promise<StacCollection> {
    try {
      const response: AxiosResponse<StacCollection> = await this.client.post("/collections", collection);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create collection: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Add an item to a collection
   */
  async addItem(collectionId: string, item: StacItem): Promise<StacItem> {
    try {
      const response: AxiosResponse<StacItem> = await this.client.post(
        `/collections/${encodeURIComponent(collectionId)}/items`,
        item
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to add item to collection ${collectionId}: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  /**
   * Health check - verify if the API is accessible
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get("/");
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get API conformance information
   */
  async getConformance(): Promise<any> {
    try {
      const response = await this.client.get("/conformance");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get conformance: ${error instanceof Error ? error.message : error}`);
    }
  }
}
