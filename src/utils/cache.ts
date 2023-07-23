import { AxiosResponse } from 'axios';

export async function setCachedData(
  cacheName: string,
  url: string,
  response: AxiosResponse<any, any>,
) {
  try {
    const cacheStorage = await caches.open(cacheName);
    const clonedResponse = new Response(JSON.stringify(response.data));
    await cacheStorage.put(url, clonedResponse);
  } catch (error) {
    console.log('setCacheStorage error', error);
  }
}

export async function getCachedData(cacheName: string, url: string) {
  try {
    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url);

    if (!cachedResponse) {
      return;
    }

    return cachedResponse.json();
  } catch (error) {
    console.error('Error while getting data from cache:', error);
  }
}
