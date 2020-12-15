
export interface IAppInfo {
  id: string;
  bundleId: string;
  name: string;
  image: string;
  author: string;
  version: string;
  platform: string;
  createDate: number;
  updateDate: number;
}

export class AppInfo implements IAppInfo {
  id: IAppInfo['id'];
  bundleId: IAppInfo['bundleId'];
  name: IAppInfo['name'];
  image: IAppInfo['image'];
  author: IAppInfo['author'];
  version: IAppInfo['version'];
  platform: IAppInfo['platform'];
  createDate: IAppInfo['createDate'];
  updateDate: IAppInfo['updateDate'];

  constructor(appInfo: IAppInfo) {
    Object.assign(this, appInfo);
  }

}