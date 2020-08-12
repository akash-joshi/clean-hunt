import React, { useState } from "react";
import axios from "axios";

import "./styles.css";

const Link = ({ url }) => (
  <a target="_blank" rel="noopener noreferrer" href={url}>
    {url}
  </a>
);

export default function App() {
  const [page, setPage] = useState(1);
  const [nbPages, setNbPages] = useState(2);
  const [results, setResults] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  console.log(results);

  const handleSearch = (e) => {
    e.preventDefault();

    setLoading(true);
    setPage(1);
    setNbPages(2);
    setResults([]);

    axios
      .get(
        `https://0h4smabbsg-dsn.algolia.net/1/indexes/Post_production?query=${searchText}&page=${page}`,
        {
          headers: {
            "X-Algolia-API-Key": "9670d2d619b9d07859448d7628eea5f3",
            "X-Algolia-Application-Id": "0H4SMABBSG",
          },
        }
      )
      .then(async (r) => {
        setNbPages(r.data.nbPages);

        await Promise.all(
          r.data.hits.map(async (hit) => {
            try {
              console.log(hit.product_links[0].url);
              await axios.get(
                `${process.env.REACT_APP_TEST_URL}?url=${hit.product_links[0].url}`
              );
              setResults((results) => {
                const nextResults = [...new Set([...results, hit])];
                return nextResults;
              });
            } catch (error) {
              console.error(error);
            }
          })
        );

        setLoading(false);
      });
  };

  const loadMore = () => {
    setPage(page + 1);
    setLoading(true);
    axios
      .get(
        `https://0h4smabbsg-dsn.algolia.net/1/indexes/Post_production?query=${searchText}&page=${
          page + 1
        }`,
        {
          headers: {
            "X-Algolia-API-Key": "9670d2d619b9d07859448d7628eea5f3",
            "X-Algolia-Application-Id": "0H4SMABBSG",
          },
        }
      )
      .then(async (r) => {
        await Promise.all(
          r.data.hits.map(async (hit) => {
            try {
              console.log(hit.product_links[0].url);
              await axios.get(
                `${process.env.REACT_APP_TEST_URL}?url=${hit.product_links[0].url}`
              );
              setResults((results) => {
                const nextResults = [...new Set([...results, hit])];
                return nextResults;
              });
            } catch (error) {
              console.error(error);
            }
          })
        );

        setLoading(false);
      });
  };

  return (
    <div
      style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}
    >
      <form onSubmit={handleSearch}>
        <input
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search Here..."
        />
        <button type="submit">Search</button>
      </form>
      {results.map((result, index) => (
        <div style={{ marginTop: "1em", marginBottom: "1em" }} key={index}>
          <div>
            {index + 1}. {result.name}
          </div>
          <div>
            PH Link: <Link url={`https://www.producthunt.com${result.url}`} />
          </div>
          <div>
            Product Link: <Link url={result.product_links[0].url} />
          </div>
        </div>
      ))}

      {page <= nbPages && !loading && results.length > 0 ? (
        <button onClick={loadMore}>Load More</button>
      ) : (
        "No Results"
      )}
      {page <= nbPages && loading && results.length > 0 && "Loading ..."}
    </div>
  );
}
