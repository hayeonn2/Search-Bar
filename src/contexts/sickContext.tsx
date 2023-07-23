import { getData } from '@/api/axiosClient';
import { useState, createContext, ReactNode } from 'react';

type SickProviderProps = {
  children: ReactNode;
};

type RecommendValueType = {
  sickCd: string;
  sickNm: string;
};

type SearchContextType = {
  recommendValue: RecommendValueType[];
  fetchRecommendData: (value: string) => Promise<RecommendValueType[]>;
};

export const sickContext = createContext<SearchContextType | null>(null);

function SickProvider({ children }: SickProviderProps) {
  const [recommendValue, setRecommendValue] = useState<RecommendValueType[]>(
    [],
  );

  const fetchRecommendData = async (search: string) => {
    try {
      const data = await getData(search);
      const sliceData = data.length >= 7 ? data.slice(0, 7) : data;
      console.info('calling api');
      setRecommendValue(sliceData);
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  return (
    <sickContext.Provider value={{ recommendValue, fetchRecommendData }}>
      {children}
    </sickContext.Provider>
  );
}

export type { RecommendValueType, SearchContextType };
export { SickProvider };
