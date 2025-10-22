/**
 * Schema Index
 * Central export point for all Mongoose models
 * Usage: import { Device, Price, ScrapeLog } from "@/lib/schema";
 */

export { Device, type IDevice } from "./Device";
export { Price, type IPrice } from "./Price";
export { ScrapeLog, type IScrapeLog } from "./ScrapeLog";
export { PriceHistory, type IPriceHistory } from "./PriceHistory";
export { Platform, type IPlatform } from "./Platform";
export { User, type IUser } from "./User";

