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
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);
  const debounceText = useDebounce(inputValue, 300);

  // debounce
  useEffect(() => {
    const fetchData = async () => {
      if (debounceText) {
        await fetchRecommendData(debounceText);
        console.log(debounceText);
      }
    };

    fetchData();
  }, [debounceText]);

  // Input change event
  const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (e.target.value === '') {
      await fetchRecommendData('');
      return;
    }
  };

  // input창 focus event
  const handleFocus = () => {
    setIsFocused((prev) => {
      return !prev;
    });
  };

  // 검색 후 setSearchHistory에 현재값과 이전에 있던 값을 배열로 추천검색어에 보여주는 것
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.trim() !== '') {
      setSearchHistory((prevSearchHistory) => [
        ...prevSearchHistory,
        inputValue,
      ]);
    }
  };

  // 추천 검색어 키로 이동하도록 구현
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prevIdx) =>
        prevIdx > 0
          ? prevIdx - 1
          : recommendValue?.length
          ? recommendValue.length - 1
          : 0,
      );
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prevIdx) =>
        prevIdx < recommendValue?.length - 1 ? prevIdx + 1 : 0,
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx !== -1 && recommendValue) {
        // 선택된 추천 검색어 처리
        const selectedSearchTerm = recommendValue[selectedIdx];
        setInputValue(selectedSearchTerm.sickNm);
      }
    }
  };

  // 컴포넌트 마운트 시 로컬 스토리지에서 검색 기록 가져오기
  useEffect(() => {
    const storedSearchHistory = localStorage.getItem('searchHistory');
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }
  }, []);

  // 검색 기록이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  return (
    <Container>
      <Title>
        국내 모든 임상시험 검색하고
        <br /> 온라인으로 참여하기
      </Title>
      <Form onSubmit={handleSearch}>
        <SearchLabel>
          <SearchInput
            type="text"
            placeholder="질환명을 입력해주세요."
            value={inputValue}
            onChange={onInputChange}
            onFocus={handleFocus}
            onBlur={handleFocus}
            onKeyDown={handleKeyDown}
          />
          <SearchButton type="submit">검색</SearchButton>
        </SearchLabel>
      </Form>

      {isFocused ? (
        <>
          {recommendValue && recommendValue.length > 0 ? (
            <ResultsContainer>
              <RecommendTitle>추천 검색어</RecommendTitle>
              {recommendValue.map((value, idx) => (
                <ResultsList
                  key={value.sickCd}
                  style={{
                    backgroundColor:
                      selectedIdx === idx ? '#f1f1f1' : 'transparent',
                  }}
                >
                  <a href="/">{value.sickNm}</a>
                </ResultsList>
              ))}
            </ResultsContainer>
          ) : searchHistory.length > 0 ? (
            <ResultsContainer>
              <RecommendTitle>최근 검색어</RecommendTitle>
              {searchHistory.map((value, idx) => (
                <ResultsList key={idx}>
                  <a href="/">{value}</a>
                </ResultsList>
              ))}
            </ResultsContainer>
          ) : (
            <ResultsContainer>
              <RecommendTitle>최근 검색어</RecommendTitle>
              <NoRecommend>최근 검색어가 없습니다.</NoRecommend>
            </ResultsContainer>
          )}
        </>
      ) : null}
    </Container>
  );
}

const Container = styled.div`
  width: 500px;
  margin: 120px auto 0;
`;

const Title = styled.h1`
  font-size: 34px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 25px;
  line-height: 1.4;
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
  padding: 10px 0 20px;
`;
const RecommendTitle = styled.li`
  color: #999;
  font-size: 14px;
  padding: 15px 30px;
`;
const ResultsList = styled.li`
  padding: 12px 30px;
`;
const NoRecommend = styled.li`
  padding: 12px 30px;
`;
