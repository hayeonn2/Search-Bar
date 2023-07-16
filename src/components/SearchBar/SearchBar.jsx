import axios from 'axios';
import { useEffect, useState } from 'react';

export function SearchBar() {
  const [sickList, setSickList] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/sick?q=담낭', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      setSickList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {sickList.map((item) => (
        <li key={item.sickCd}>
          <span>{item.sickCd}</span>
          <span>{item.sickNm}</span>
        </li>
      ))}
    </div>
  );
}
