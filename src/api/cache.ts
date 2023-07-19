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
      'content-length': '2',
    },
  };

  const clonedResponse = new Response(JSON.stringify(response), init);
  await cacheStorage.put(url, clonedResponse);

  return;
}

export async function getCachedData(cacheName: string, url: string) {
  try {
    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url);

    if (!cachedResponse || !cachedResponse.ok) {
      return false;
    }

    return await cachedResponse.json();
  } catch (error) {
    console.error('Error while getting data from cache:', error);
    return false;
  }
}
