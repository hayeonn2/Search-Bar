import axios from 'axios';
import { RecommendValueType } from '@/contexts/sickContext';

const base_url = 'http://localhost:4000/sick';

export const getData = async (
  search: string,
): Promise<RecommendValueType[] | undefined> => {
  try {
    const response = await axios.get(`${base_url}?q=${search}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.filter((item: RecommendValueType) =>
      item.sickNm.startsWith(search),
    );
  } catch (err) {
    console.log(err);
  }
};
