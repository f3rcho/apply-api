export interface ContentfulResponse {
  sys: Sys;
  total: number;
  skip: number;
  limit: number;
  items: Item[];
}

interface Item {
  metadata: Metadata;
  sys: Sys3;
  fields: Fields;
}

export interface Fields {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
}

interface Sys3 {
  space: Space;
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: Space;
  revision: number;
  contentType: Space;
  locale: string;
}

interface Space {
  sys: Sys2;
}

interface Sys2 {
  type: string;
  linkType: string;
  id: string;
}

interface Metadata {
  tags: any[];
}

interface Sys {
  type: string;
}
