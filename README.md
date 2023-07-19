# 원티드 프리온보딩 4주차 과제
![Jul-19-2023 23-24-40](https://github.com/hayeonn2/pre-onboarding-11th-4-1/assets/111109573/eb269dbb-f6bd-4772-993e-5243a92b5d94)

<br/>

## 실행방법
[api server](https://github.com/walking-sunset/assignment-api)
로 이동해 4000포트에서 api 서버를 연 후 실행해주세요.
```
$ npm install
$ process.env.REACT_APP_GIT_ISSUE_ACCESS_TOKEN="<개인Token>"
$ npm  start
```

<br/>


## 개발환경
- 언어 : typescript
- 라이브러리 및 프레임워크: react, vite, context api, axios, styled-components, react-router-dom, eslint, prettier

<br/>

# 기능 구현
## 검색어 추천 기능
```ts
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
```
- 검색어가 없을 때 빈 배열을 반환해서 전체 데이터를 받지 않게 구현했습니다.
- filter를 이용해 전체 데이터 중 7개만 잘라서 받아오게 했고 그 단어가 포함된 검색어만 반환하게 했습니다.

```jsx
{recommendValue && recommendValue.length > 0 ? (
            recommendValue.map((value, idx) => (
              <ResultsList
                key={value.sickCd}
                style={{
                  backgroundColor:
                    selectedIdx === idx ? '#f1f1f1' : 'transparent',
                }}
              >
                <a href="/">{value.sickNm}</a>
              </ResultsList>
            ))
          ) : searchHistory.length > 0 ? (
            searchHistory.map((value, idx) => (
              <NoRecommend key={idx}>
                <a href="/">{value}</a>
              </NoRecommend>
            ))
          ) : (
            <NoRecommend>검색어가 없습니다.</NoRecommend>
          )}
```
- 추천 검색어를 받아오도록 코드를 짰고 `searchHistory`에 값이 없다면 '검색어가 없습니다.'를 반환합니다.

<br/>

## API 호출 횟수 줄이기
- 사용자가 input에 값을 입력할 때마다 api가 호출됩니다.
- 이렇게 된다면 서버에 요청을 많이 하게 되는 것과 같아 서버에 과부화를 일으킬 수 있습니다.

### Debouncing
사용자가 검색어를 입력할 때마다 api를 호출하지 않고 디바운싱을 적용한다면 사용자가 입력을 모두 끝내고 일정 시간이 지났을 때 api를 호출하게 되어 api 요청 횟수를 줄일 수 있습니다.

```jsx
  import { useEffect, useState } from 'react';

const useDebounce = (value: string, delay: number) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounceValue;
};

export default useDebounce;
```
- useDebounce훅을 생성합니다. 이 훅은 사용자가 입력할 때 일정한 지연 시간을 주어서 불필요한 api 요청 횟수를 줄입니다.

```jsx
  const debounceText = useDebounce(inputValue, 300);

  // debounce
  useEffect(() => {
    const fetchData = async () => {
      if (debounceText) {
        await fetchRecommendData(debounceText);
      }
    };

    fetchData();
  }, [debounceText]);
```
- useEffect 내부에서 useDebounce훅을 사용한 debounceText를 가지고 통신을 해줍니다.

<br/>

## 키보드로 검색어 이동
```jsx
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
```
- key event는 검색어를 입력했을 때 나오는 창에서만 적용됩니다.
- `ArrowUp`, `ArrowDown`을 통해 검색어 리스트를 선택할 수 있습니다.

