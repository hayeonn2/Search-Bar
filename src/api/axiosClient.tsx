import axios, { AxiosAdapter } from 'axios';
import { RecommendValueType } from '@/contexts/sickContext';
import { cacheAdapterEnhancer } from 'axios-extensions';
import { getCachedData, setCachedData } from './cache';

const base_url = 'http://localhost:4000/sick';

export const getData = async (
  search: string,
): Promise<RecommendValueType[]> => {
  try {
    const cacheName = `cache_${search}`;
    const url = `${base_url}?q=${search}`;

    let cacheData = await getCachedData(cacheName, url);

    if (cacheData) {
      return cacheData;
    }

    if (search === '') {
      return [];
    }
    const response = await axios.get(`${base_url}?q=${search}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        name: search,
      },
    });

    await setCachedData(cacheName, url, response);

    console.log(response.data);
    return response.data
      .filter((item: RecommendValueType) => item.sickNm.includes(search))
      .slice(0, 7);
  } catch (err) {
    console.log(err);
    return [];
  }
};
