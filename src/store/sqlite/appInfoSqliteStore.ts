import * as sqlite3 from 'sqlite3';
import { SqliteStore } from ".";
import { IAppInfoStore } from "..";
import { AppInfo, IAppInfo } from '../../model/AppInfo';

export class AppInfoSqliteStore extends SqliteStore implements IAppInfoStore {

  constructor(path: string){
      super(path, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
  }

  getAllApps(): Promise<IAppInfo[]> {
    return new Promise(async (resolve: Function, reject: Function) => {
      await this.createTable();
      this._store.all(
        "SELECT appId, bundleId, name, image, author, version, platform, create_date, update_date FROM appInfo",
        (err: string, rows: any[]) => {
          if (err) return reject(err);
          if(rows.length <= 0){
            return resolve([]);
          }

          const appInfos: IAppInfo[] = rows.map( (result: any) : IAppInfo => {
            return new AppInfo({
              id: result.appId,
              bundleId: result.bundleId,
              name: result.name,
              image: result.image,
              author: result.author,
              version: result.version,
              platform: result.platform,
              createDate: result.create_date,
              updateDate: result.update_date,
            });
          });

          return resolve(appInfos);
        }
      )
    });
  }


  getAppById(appId: string): Promise<IAppInfo> {
    return new Promise(async (resolve: Function, reject: Function) => {
      await this.createTable();
      this._store.all(
        "SELECT appId, bundleId, name, image, author, version, platform, create_date, update_date FROM appInfo WHERE appId=? LIMIT 1",
        [appId],
        (err: string, rows: any[]) => {
          if (err) return reject(err);
          if(rows.length <= 0){
            return resolve(null);
          }

          const result: any = rows[0];

          return resolve(new AppInfo({
            id: result.appId,
            bundleId: result.bundleId,
            name: result.name,
            image: result.image,
            author: result.author,
            version: result.version,
            platform: result.platform,
            createDate: result.create_date,
            updateDate: result.update_date,
          }));

        }
      )
    });
  }

  deleteById(appId: string): Promise<void> {
    return new Promise(async (resolve: Function, reject: Function) => {
      const stmt = this._store.prepare('DELETE FROM appInfo WHERE appId=?');
      stmt.run(appId, (result: sqlite3.RunResult, err: Error) => {
        stmt.finalize();
        if(err) return reject(err);
        return resolve(result);
      });
    });
  }

  add(app: IAppInfo): Promise<IAppInfo> {
    return new Promise(async (resolve: Function, reject: Function) => {
      const stmt = this._store.prepare(
        'INSERT OR REPLACE INTO appInfo (appId, bundleId, name, image, author, version, platform, create_date, update_date) VALUES (?,?,?,?,?,?,?,?,?)'
      );

      stmt.run(app.id,
        app.bundleId,
        app.name,
        app.image,
        app.author,
        app.version,
        app.platform,
        app.createDate,
        app.updateDate,
        (_1: sqlite3.RunResult, err: Error) => {
          stmt.finalize();
          if(err) return reject(err);
          return resolve(app);
      });
    });
  }

  createTable = async () => {
    return new Promise(async (resolve: Function, _2: Function) => {
        this._store.run(
            'CREATE TABLE IF NOT EXISTS appInfo ( \
              appId VARCHAR(100), \
              bundleId VARCHAR(100), \
              name VARCHAR(255), \
              image TEXT, \
              author VARCHAR(255), \
              version VARCHAR(50), \
              platform VARCHAR(20), \
              create_date BIGINT, \
              update_date BIGINT, \
              PRIMARY KEY("appId"))',
            (_1: sqlite3.RunResult, _2: Error) => {
                resolve();
            }
        );
    });
  };


}