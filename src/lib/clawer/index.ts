import * as axios from 'axios';
import { AppInfo, IAppInfo } from '../../model/AppInfo';

export const GetAppStoreInfo = async (appId: string): Promise<IAppInfo> => {
  return new Promise(async (resolve: Function, reject: Function) => {
    try {
      const result = await axios.default.get(`https://itunes.apple.com/jp/lookup?id=${appId}&t=${Date.now()}`);

      const firstResult = result.data.results[0];

      const appInfo: IAppInfo = new AppInfo({
        id: appId,
        bundleId: firstResult.bundleId,
        name: firstResult.trackName,
        image: firstResult.artworkUrl512,
        author: firstResult.artistName,
        version: firstResult.version,
        platform: 'ios',
        createDate: Date.now(),
        updateDate: Date.now(),
      });

      return resolve(appInfo);

    } catch (err: any){
      return reject(err);
    }
  });
};

const ExtractAppInfoFromHTML = (htmlData: string) : any => {
  const result = htmlData.match(/\{\"\@context\".*\]\}\<\/script\>/g);
  if(!result) return null;
  return JSON.parse(result[0].replace("</script>",""));
}

const ExtractAppVersionFromHTML = (htmlData: string) : any => {
  const result = htmlData.match("<div[^>]*?>Current Version<\/div><span[^>]*?><div[^>]*?><span[^>]*?>(.*?)<\/span><\/div>");
  if(!result) return null;
  return result[1];
}


export const GetPlayStoreInfo = async (appId: string): Promise<IAppInfo> => {
  return new Promise(async (resolve: Function, reject: Function) => {
    try {
      const result = await axios.default.get(
        `https://play.google.com/store/apps/details?id=${appId}`,
        {
          transformResponse: (data) => data
        }
      );

      const appDetail = ExtractAppInfoFromHTML(result.data);
      const appVersion = ExtractAppVersionFromHTML(result.data);

      const appInfo: IAppInfo = new AppInfo({
        id: appId,
        bundleId: appId,
        name: appDetail.name,
        image: appDetail.image,
        author: appDetail.author.name,
        version: appVersion,
        platform: 'android',
        createDate: Date.now(),
        updateDate: Date.now(),
      });

      return resolve(appInfo);

    } catch (err: any){
      return reject(err);
    }
  });
};