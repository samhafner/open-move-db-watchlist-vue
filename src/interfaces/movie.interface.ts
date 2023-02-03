import { SearchResult } from "./omdb.api.interface";

export interface Movie extends SearchResult {
    watched?: boolean;
}