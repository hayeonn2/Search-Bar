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
  recommendValue: RecommendValueType[] | undefined;
  // 리턴안하면 <void>
  fetchRecommendData: (
    value: string,
  ) => Promise<RecommendValueType[] | undefined>;
};

export const sickContext = createContext<SearchContextType | null>(null);

function SickProvider({ children }: SickProviderProps) {
  const [recommendValue, setRecommendValue] = useState<
    RecommendValueType[] | undefined
  >([]);

  const fetchRecommendData = async (search: string) => {
    try {
      let data = await getData(search);
      console.info('calling api');
      setRecommendValue(data);
      return data;
    } catch (error) {
      console.log(error);
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
