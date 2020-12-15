import { IAppInfo } from '../model/AppInfo';

export interface IStore {

}

export interface IAppInfoStore extends IStore {
  getAllApps(): Promise<IAppInfo[]>
  getAppById(appId: string) : Promise<IAppInfo>
  deleteById(appId: string) : Promise<void>
  add(app: IAppInfo) : Promise<IAppInfo>
}

export class AppInfoStore {
  client: IAppInfoStore;

  setClient(client: IAppInfoStore) {
    this.client = client;
  }

  getAllApps(): Promise<IAppInfo[]> {
    return this.client.getAllApps();
  }

  getAppById(appId: string) : Promise<IAppInfo> {
    return this.client.getAppById(appId);
  }

  deleteById(appId: string) : Promise<void> {
    return this.client.deleteById(appId);
  }

  add(app: IAppInfo) : Promise<IAppInfo> {
    return this.client.add(app);
  }

}

export const appInfoStore = new AppInfoStore();
