type ParamObject = {
  [key: string]: string | number;
};

export class UrlUtil {

  static getRequiredUrl(url: string, obj: ParamObject): string {
    let replacedUrl = url;
    const keys = Object.keys(obj);
    for (let i = 0; i < keys?.length; i++) {
      replacedUrl = replacedUrl.replace(`:${keys[i]}`, obj[keys[i]]?.toString());
    }
    return replacedUrl;
  }
}
