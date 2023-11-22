import FetchCache from "./FetchCache";
import {
  AbilityWithRelated,
  CharacterWithRelated,
  CreatureWithRelated,
  ItemWithRelated,
  ListRequest,
} from "./types";

class BaseAPI {
  protected cache: FetchCache;
  protected headers: Headers;

  constructor(
    protected baseUrl: string,
    headers: HeadersInit,
    cachePath: string,
  ) {
    this.cache = new FetchCache(cachePath);
    this.headers = new Headers(headers);
  }

  async get<T>(url: string): Promise<ListRequest<T>> {
    const { baseUrl, headers } = this;

    const fullUrl = baseUrl + url;
    let data;

    if (this.cache.has(fullUrl)) data = this.cache.get(fullUrl);
    else {
      console.log("Fetching:", fullUrl);

      const response = await fetch(fullUrl, { headers });
      const text = await response.text();
      this.cache.set(fullUrl, text);

      data = text;
    }

    return JSON.parse(data) as ListRequest<T>;
  }

  async getAll<T>(url: string) {
    const data: T[] = [];
    let page = 0;
    let going = true;

    while (going) {
      page++;
      const fullUrl = `${url}&page=${page}`;
      const result = await this.get<T>(fullUrl);
      data.push(...result.data);

      if (result.meta.current_page === result.meta.last_page) going = false;
    }

    return data;
  }
}

export default class KankaAPI extends BaseAPI {
  constructor(
    private token: string,
    public version = `1.0`,
    cachePath = "./local-only/fetch-cache/",
  ) {
    super(
      `https://api.kanka.io/${version}/`,
      {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      cachePath,
    );
  }

  campaign(campaignId: number) {
    return new KankaCampaignAPI(this.token, campaignId, this.version);
  }
}

export class KankaCampaignAPI extends BaseAPI {
  constructor(
    private token: string,
    public campaignId: number,
    public version = `1.0`,
    cachePath = "./local-only/fetch-cache/",
  ) {
    super(
      `https://api.kanka.io/${version}/campaigns/${campaignId}/`,
      {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      cachePath,
    );
  }

  allAbilities() {
    return this.getAll<AbilityWithRelated>("abilities?related=1");
  }

  allCharacters() {
    return this.getAll<CharacterWithRelated>("characters?related=1");
  }

  allCreatures() {
    return this.getAll<CreatureWithRelated>("creatures?related=1");
  }

  allItems() {
    return this.getAll<ItemWithRelated>("items?related=1");
  }
}
