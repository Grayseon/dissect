import { DissectOptions, Results } from "../types/types.mjs";
import Dissection from "./Dissection.mjs";
declare function processSelectorArray(selectors: string[], key: string, dissection: Dissection, options: DissectOptions, results: Results, depth: number): void;
declare function iterateSelectors(selectors: string[], dissection: Dissection, options: DissectOptions, depth?: number): string[];
declare function iterateSelectors<T extends Results>(selectors: T, dissection: Dissection, options: DissectOptions, depth?: number): T;
export { processSelectorArray, iterateSelectors };
