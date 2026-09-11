import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { SavedGame } from "./types.js";
export class Store {
  private db: DatabaseSync;
  constructor(path: string) {
    if (path !== ":memory:")
      mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(path);
    this.db.exec(
      "PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS current_game (id INTEGER PRIMARY KEY CHECK(id=1), data TEXT NOT NULL)",
    );
  }
  load(): SavedGame | undefined {
    const row = this.db
      .prepare("SELECT data FROM current_game WHERE id=1")
      .get();
    return row ? (JSON.parse(String(row.data)) as SavedGame) : undefined;
  }
  save(game: SavedGame) {
    this.db
      .prepare(
        "INSERT INTO current_game(id,data) VALUES(1,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data",
      )
      .run(JSON.stringify(game));
  }
  close() {
    this.db.close();
  }
}
