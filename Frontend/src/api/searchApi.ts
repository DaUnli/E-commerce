import api from "./axios";

export const searchApi = {
  search: (query?: string) => {
    const url = query
      ? `/products/search?query=${encodeURIComponent(query)}`
      : "/products/search";

    return api.get(url);
  },
};