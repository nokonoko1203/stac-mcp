/**
 * TypeScript interfaces for STAC (SpatioTemporal Asset Catalog) objects
 */

import { Geometry } from "geojson";

export interface StacCollection {
  id: string;
  type: "Collection";
  stac_version: string;
  title?: string;
  description?: string;
  license: string;
  extent: StacExtent;
  links: StacLink[];
  providers?: StacProvider[];
  summaries?: Record<string, any>;
  [key: string]: any;
}

export interface StacItem {
  id: string;
  type: "Feature";
  stac_version: string;
  geometry: Geometry;
  bbox?: [number, number, number, number];
  properties: StacItemProperties;
  links: StacLink[];
  assets: Record<string, StacAsset>;
  collection?: string;
  [key: string]: any;
}

export interface StacItemProperties {
  datetime: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

export interface StacAsset {
  href: string;
  type?: string;
  title?: string;
  description?: string;
  roles?: string[];
  [key: string]: any;
}

export interface StacExtent {
  spatial: {
    bbox: number[][];
  };
  temporal: {
    interval: (string | null)[][];
  };
}

export interface StacLink {
  rel: string;
  href: string;
  type?: string;
  title?: string;
  [key: string]: any;
}

export interface StacProvider {
  name: string;
  description?: string;
  roles?: string[];
  url?: string;
  [key: string]: any;
}

export interface StacItemCollection {
  type: "FeatureCollection";
  features: StacItem[];
  links?: StacLink[];
  context?: {
    page?: number;
    limit?: number;
    matched?: number;
    returned?: number;
  };
  [key: string]: any;
}

export interface StacCollectionList {
  collections: StacCollection[];
  links?: StacLink[];
  [key: string]: any;
}

export interface StacSearchParams {
  collections?: string[];
  bbox?: [number, number, number, number];
  datetime?: string;
  query?: Record<string, any>;
  filter?: any;
  sortby?: any;
  fields?: any;
  limit?: number;
  token?: string;
}

export interface StacApiError {
  code: string;
  description: string;
}
