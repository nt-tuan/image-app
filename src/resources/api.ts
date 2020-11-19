import { ImageInfo, ImageHistory } from "resources/models";
const base = process.env.REACT_APP_API_URL;
export interface RequestError {
  Err: string;
}
export const UnauthorizeError = { Err: "unauthorized" };
async function request<T>(
  method: string,
  path: string,
  body?: BodyInit,
  token?: string,
  extraHeaders?: { [key: string]: string }
): Promise<T> {
  const url = base + path;
  const baseHeaders = extraHeaders
    ? extraHeaders
    : {
        "Content-Type": "application/json",
      };
  const headers = token
    ? { ...baseHeaders, Authorization: `Bearer ${token}` }
    : baseHeaders;
  const response = await fetch(url, { method, headers, body });
  const text = await response.text();
  if (response.ok) {
    if (text == null || text === "") return {} as T;
    return JSON.parse(text);
  }
  if (response.status === 401) return Promise.reject(UnauthorizeError);
  if (text == null || text === "")
    return Promise.reject({ Err: response.statusText });
  return Promise.reject(JSON.parse(text) as RequestError);
}

const get = async (token: string) => {
  const url = `/admin/images?pageSize=999999&pageCurrent=0&orderBy=id`;
  var res = await request<ImageInfo[]>("GET", url, undefined, token);
  if (res == null) {
    return Promise.reject("invalid-data");
  }
  const time = new Date();
  return res.map((image) => ({ ...image, time, link: getPreviewLink(image) }));
};

const getByID = async (id: number, token: string) => {
  const url = `/admin/image/${id}`;
  var image = await request<ImageInfo>("GET", url, undefined, token);
  if (image === undefined) {
    return Promise.reject("invalid-data");
  }
  return image;
};

const upload = async (name: string, data: File, token: string) => {
  const formData = new FormData();
  formData.append("file", data);
  formData.append("name", name);
  const image = await request<ImageInfo>(
    "POST",
    `/admin/image`,
    formData,
    token,
    {}
  );
  if (image === undefined) {
    return Promise.reject("invalid-data");
  }
  image.tags = [];
  return image;
};

const rename = async (id: number, name: string, token: string) => {
  const body = { name };
  return await request<void>(
    "POST",
    `/admin/image/${id}/rename`,
    JSON.stringify(body),
    token
  );
};
const replace = async (id: number, file: File, token: string) => {
  const formData = new FormData();
  formData.append("file", file);
  return await request<void>(
    "POST",
    `/admin/image/${id}/replace`,
    formData,
    token,
    {}
  );
};

const _delete = async (id: number, token: string) => {
  return request("DELETE", `/admin/image/${id}`, undefined, token);
};

const addTag = async (id: number, tag: string, token: string) => {
  return request("PUT", `/admin/image/${id}/tag/${tag}`, undefined, token);
};

const deleteTag = async (id: number, tag: string, token: string) => {
  return request("DELETE", `/admin/image/${id}/tag/${tag}`, undefined, token);
};
const purgeCache = (id: number, token: string) => {
  return request("POST", `/admin/image/${id}/purgeCache`, undefined, token);
};
const getPreviewLink = (image: ImageInfo) => {
  return `${base}/nocache/images/static/${image.fullname}`;
};
const getProductionLink = (image: ImageInfo) =>
  `${base}/images/static/${image.fullname}`;
const getResizedLink = (image: ImageInfo, w: number, h: number) =>
  `${base}/images/size/${w}/${h}/${image.fullname}`;
const getWebpResizedLink = (image: ImageInfo, w: number, h: number) =>
  `${base}/images/webp/${w}/${h}/${image.fullname}`;
const getImageHistories = (id: number, token: string) =>
  request<ImageHistory[]>(
    "GET",
    `/admin/image/${id}/history`,
    undefined,
    token
  );
const getDeletedImages = (token: string) =>
  request<ImageHistory[]>("GET", "/admin/deletedImages", undefined, token);
const restoreDeletedImage = (id: number, token: string) =>
  request<ImageInfo>(
    "POST",
    `/admin/deletedImage/${id}/restore`,
    undefined,
    token
  );
const getDeletedImageURL = (backupPath?: string) =>
  `${base}/history/static/${backupPath}`;
const getDeletedImageObjectURL = async (
  backupPath: string | undefined,
  token: string
) => {
  const response = await fetch(getDeletedImageURL(backupPath), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
export const imageAPI = {
  get,
  getByID,
  upload,
  rename,
  replace,
  delete: _delete,
  addTag,
  deleteTag,
  getPreviewLink: getPreviewLink,
  getProductionLink,
  getResizedLink,
  getWebpResizedLink,
  purgeCache,
  getImageHistories,
  getDeletedImages,
  restoreDeletedImage,
  getDeletedImageObjectURL,
  getDeletedImageURL,
};
