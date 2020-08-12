import React, { useState } from "react";
import axios from "axios";

import "./styles.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [nbPages, setNbPages] = useState(2);
  const [results, setResults] = useState([]);

  console.log(results);

  const debounce = (f, ms) => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(f, ms);
    };
  };

  const handleSearch = e => {
    setPage(1);
    setNbPages(2);

    axios
      .get(
        `https://0h4smabbsg-dsn.algolia.net/1/indexes/Post_production?query=${
          e.target.value
        }&page=${page}`,
        {
          headers: {
            "X-Algolia-API-Key": "9670d2d619b9d07859448d7628eea5f3",
            "X-Algolia-Application-Id": "0H4SMABBSG"
          }
        }
      )
      .then(r => {
        setNbPages(r.data.nbPages);

        r.data.hits.map(async hit => {
          try {
            console.log(hit.product_links[0].url);
            await axios.head(hit.product_links[0].url);
            setResults(results => [...results, hit]);
          } catch (error) {
            console.error(error);
          }
        });
      });
  };

  return (
    <div>
      <input
        onChange={e => debounce(handleSearch(e), 250)}
        placeholder="Search Here..."
      />
      {results.map((result, index) => (
        <div key={index}>
          <div>{result.name}</div>
          <div>
            PH Link:{" "}
            <a href={`https://www.producthunt.com${result.url}`}>
              https://www.producthunt.com{result.url}
            </a>
          </div>
          <div>
            Product Link:{" "}
            <a href={result.product_links[0].url}>
              {result.product_links[0].url}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
