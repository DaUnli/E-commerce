import api from "./axios";

export const searchApi = {
  search: (query?: string) => {
    const url = query
      ? `/search?query=${encodeURIComponent(query)}`
      : "/search";
    return api.get(url);
  },
};
