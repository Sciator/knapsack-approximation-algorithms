import { existsSync, readFileSync, writeFileSync } from "fs";

export class JSONFile<T> {
  public readonly fileName: string;
  private get file(): string {
    return this.fileName + ".json";
  }

  public write(data: T): void {
    const file = this.file;
    writeFileSync(file,
      JSON.stringify(this.readAll().concat(data)));
  }

  public readAll(): T[] {
    const file = this.file;
    if (!existsSync(file))
      return [];

    const data = JSON.parse(
      readFileSync(file).toString());

    return data as T[];
  }

  constructor(fileName: string) {
    this.fileName = fileName;
  }
}
