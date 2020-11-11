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
): Promise<T | void> {
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
    if (text == null || text === "") return;
    return JSON.parse(text);
  }
  if (response.status === 401) return Promise.reject(UnauthorizeError);
  if (text == null || text === "")
    return Promise.reject({ Err: response.statusText });
  return Promise.reject(JSON.parse(text) as RequestError);
}

export interface IImage {
  fullname: string;
  id: number;
  tags: string[];
  time: Date;
}

const get = async (token: string) => {
  const url = `/admin/images?pageSize=999999&pageCurrent=0&orderBy=id`;
  var res = await request<IImage[]>("GET", url, undefined, token);
  if (res == null) {
    return Promise.reject("invalid-data");
  }
  const time = new Date();
  return res.map((images) => ({ ...images, time }));
};

const getByID = async (id: number, token: string) => {
  const url = `/admin/image/${id}`;
  var res = await request<IImage>("GET", url, undefined, token);
  if (res === undefined) {
    return Promise.reject("invalid-data");
  }
  res.time = new Date();
  return res;
};

const upload = async (name: string, data: File, token: string) => {
  const formData = new FormData();
  formData.append("file", data);
  formData.append("name", name);
  const image = await request<IImage>(
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
  image.time = new Date();
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
const getPreviewLink = (image: IImage) => {
  return `${base}/nocache/images/static/${image.fullname}`;
};
const getProductionLink = (image: IImage) =>
  `${base}/images/static/${image.fullname}`;
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
  purgeCache,
};
