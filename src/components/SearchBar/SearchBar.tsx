import { sickContext } from '@/contexts/sickContext';
import { useContext, useEffect, useState, ChangeEvent } from 'react';
import { SearchContextType } from '@/contexts/sickContext';
import useDebounce from '@/hooks/useDebounce';
import styled from 'styled-components';

export function SearchBar() {
  const { recommendValue, fetchRecommendData } = useContext(
    sickContext,
  ) as SearchContextType;
  const [inputValue, setInputValue] = useState<string>('');
  const debounceText = useDebounce(inputValue, 300);
  const limitedList = recommendValue?.slice(0, 7);

  useEffect(() => {
    if (debounceText) {
      fetchRecommendData(debounceText);
      console.log(debounceText);
    }
  }, [debounceText]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value === '') {
      fetchRecommendData('');
      return;
    }
  };

  return (
    <Container>
      <Form>
        <SearchLabel>
          <SearchInput
            type="text"
            placeholder="질환명을 입력해주세요."
            value={inputValue}
            onChange={onInputChange}
          />
          <SearchButton type="submit">검색</SearchButton>
        </SearchLabel>
      </Form>

      <ResultsContainer>
        <RecommendTitle>추천 검색어</RecommendTitle>
        {limitedList?.map((value) => (
          <ResultsList key={value.sickCd}>
            <a href="/">{value.sickNm}</a>
          </ResultsList>
        ))}
      </ResultsContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 500px;
  margin: 120px auto 0;
`;

const Form = styled.form`
  position: relative;
`;

const SearchLabel = styled.label`
  display: flex;
  background-color: #fff;
  border-radius: 60px;
  padding: 20px 30px;
  box-shadow: 0px 2px 4px rgba(30, 32, 37, 0.1);
`;

const SearchInput = styled.input`
  width: 80%;
  background-color: #fff;
  border: 0;
`;

const SearchButton = styled.button`
  border: none;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: #357ae1;
  color: #fff;
  border-radius: 0 50px 50px 0;
  padding: 21px 30px;
`;

const ResultsContainer = styled.ul`
  margin: 10px auto 0;
  background: #fff;
  border-radius: 15px;
  padding: 20px 30px;
`;
const RecommendTitle = styled.li`
  color: #999;
  font-size: 14px;
  margin-bottom: 18px;
`;
const ResultsList = styled.li`
  margin-bottom: 25px;
  &:last-child {
    margin-bottom: 5px;
  }
`;
