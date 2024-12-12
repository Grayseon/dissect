export default class DissectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DissectionError";
  }
}