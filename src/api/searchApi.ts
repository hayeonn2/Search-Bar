import { RecommendValueType } from '@/contexts/sickContext';
import { getCachedData, setCachedData } from '../utils/cache';
import { BASE_URL, api } from './apiClient';

export const getData = async (
  search: string,
): Promise<RecommendValueType[]> => {
  try {
    const cacheName = `searchList`;
    const url = `${BASE_URL}?q=${search}`;
    const cacheData = await getCachedData(cacheName, url);

    if (search === '') {
      return [];
    }

    if (cacheData) {
      return cacheData;
    }

    const response = await api.get(url, {
      params: {
        name: search,
      },
    });

    console.info('calling api');
    await setCachedData(cacheName, url, response);

    const filteredData = response.data.filter((item: RecommendValueType) =>
      item.sickNm.includes(search),
    );
    // console.log('api에서 가져온 데이터', filteredData);
    return filteredData;
  } catch (err) {
    console.log(err);
    return [];
  }
};
