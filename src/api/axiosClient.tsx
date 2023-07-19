import axios from 'axios';
import { RecommendValueType } from '@/contexts/sickContext';

const base_url = 'http://localhost:4000/sick';

export const getData = async (
  search: string,
): Promise<RecommendValueType[]> => {
  try {
    if (search === '') {
      return [];
    }
    const response = await axios.get(`${base_url}?q=${search}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    return response.data
      .filter((item: RecommendValueType) => item.sickNm.includes(search))
      .slice(0, 7);
  } catch (err) {
    console.log(err);
    return [];
  }
};
