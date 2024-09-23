import {Base, IDBService} from "./DB/Base.js";
import {ServiceSchema} from "moleculer";

export const DB: Partial<ServiceSchema> & { Base: Partial<ServiceSchema<IDBService>> } = {
  Base
}