import axios from 'axios';
import { useEffect, useState } from 'react';

export function SearchBar() {
  //const [sickList, setSickList] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/sick?q=담낭', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      //setSickList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <form>
        <input type="text" placeholder="질환명을 입력해주세요." />
        <button type="submit">검색하기</button>
      </form>
    </div>
  );
}
