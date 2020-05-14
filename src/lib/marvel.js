import queryString from "query-string";

import { PAGE_SIZE } from "../config";

const API_PREFIX = "https://marveldb.now.sh/api/v1/public";

const marvel = {};

const RESOURCES = {
  characters: ["comics", "events", "series", "stories"],
  comics: ["characters", "creators", "events", "stories"],
  creators: ["comics", "events", "series", "stories"],
  events: ["characters", "comics", "creators", "series", "stories"],
  series: ["characters", "comics", "creators", "events", "stories"],
  stories: ["characters", "comics", "creators", "events", "series"],
};

const fetchApi = (path, params) => {
  params = { ...params };

  const page = params.page == null || params.page < 1 ? 1 : params.page;
  delete params.page;
  params.offset = (page - 1) * PAGE_SIZE;
  params.limit = PAGE_SIZE;

  const clearedParams = Object.keys(params).reduce((acc, k) => {
    if (params[k] != null && params[k] !== "") {
      acc[k] = params[k];
    }
    return acc;
  }, {});

  const url = `${API_PREFIX}${path}?${queryString.stringify(clearedParams)}`;

  const controller = new AbortController();
  const { signal } = controller;

  const p = fetch(url, { signal })
    .then((response) => response.json())
    .catch((err) => {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("aborted", url);
        return;
      }
      throw err;
    });
  p.abort = () => {
    console.log("abort", url);
    controller.abort();
  };
  return p;
};

const createResource = (resource, subResources) => {
  const wrapper = (id) => {
    const instanceWrapper = {
      get: (params) => fetchApi(`/${resource}/${id}`, params),
    };
    subResources.forEach((subResource) => {
      instanceWrapper[subResource] = {
        get: (params) => fetchApi(`/${resource}/${id}/${subResource}`, params),
      };
    });
    return instanceWrapper;
  };
  wrapper.get = (params) => fetchApi(`/${resource}`, params);
  return wrapper;
};

Object.keys(RESOURCES).forEach((resource) => {
  marvel[resource] = createResource(resource, RESOURCES[resource]);
});

marvel.getImage = (entry) => `${entry.path}.${entry.extension}`;

export default marvel;
