import { WithId } from "mongodb";

export type DocumentWithId = WithId<Document>;

export interface Metadata {
  totalStoriesCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface AggregationResult {
  metadata: Metadata[];
  results: DocumentWithId[];
}
