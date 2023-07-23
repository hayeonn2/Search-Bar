import { AxiosResponse } from 'axios';

export async function setCachedData(
  cacheName: string,
  url: string,
  response: AxiosResponse<any, any>,
) {
  // cache open
  const cacheStorage = await caches.open(cacheName);
  const init = {
    headers: {
      'Content-Type': 'application/json, charset=utf-8',
    },
  };
  const clonedResponse = new Response(JSON.stringify(response.data), init);
  await cacheStorage.put(url, clonedResponse);
  console.log('Data has been stored in the cache.');
}

export async function getCachedData(cacheName: string, url: string) {
  try {
    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url);

    if (cachedResponse) {
      try {
        const data = await cachedResponse.json();
        console.log('캐시에서 데이터를 가져왔습니다:', data);
        return data;
      } catch (error) {
        console.error(
          '캐시 데이터를 JSON으로 변환하는데 에러가 발생했습니다:',
          error,
        );
        return null;
      }
    } else {
      console.log('캐시에 해당 데이터가 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('Error while getting data from cache:', error);
    return false;
  }
}

export const getIsCachedExpired = () => {};
