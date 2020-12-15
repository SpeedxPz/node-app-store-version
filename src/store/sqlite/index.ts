
import * as sqlite3 from 'sqlite3';
import { IStore } from '..';


export class SqliteStore implements IStore {
    _store: sqlite3.Database;

    constructor(path: string, mode: number) {
        this._store = new sqlite3.Database(path, mode, (err) => {
            if(err) {
                console.error(err.message);
                throw err;
            }
        })
    }
  }