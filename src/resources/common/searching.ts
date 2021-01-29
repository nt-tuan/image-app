const searchByTagPattern = /^\[.*\]/g;
const normalizePattern = /[^\-a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/g;
const normalizePathPattern = /[^\-/a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/g;
export const normalizeName = (text: string) => {
  return text.trim().toLowerCase().replace(normalizePattern, "");
};
export const normalizePath = (text: string) => {
  return text.trim().toLowerCase().replace(normalizePathPattern, "");
};
export const extractSearchQuery = (text: string) => {
  const tagExpress = text.match(searchByTagPattern);
  const tags =
    tagExpress && tagExpress.length > 0
      ? tagExpress[0]
          .split(",")
          .map((tag) => normalizeName(tag))
          .filter((tag) => tag !== "")
      : [];
  const searchPattern = text.replace(searchByTagPattern, "");
  if (searchPattern !== text || tags.length > 0) {
    return {
      regexp: null,
      tags,
    };
  }

  try {
    const normalizedText = new RegExp(searchPattern, "i");
    return {
      regexp: normalizedText,
      tags,
    };
  } catch (e) {
    return { regex: null, tags, error: e };
  }
};
