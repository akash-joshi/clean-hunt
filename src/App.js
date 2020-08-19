import React, { useState, useEffect } from "react";
import axios from "axios";
import { hot } from "react-hot-loader";
import "semantic-ui-css/semantic.min.css";
import styled from "styled-components";

import "./styles.css";

import { Input, Button } from "semantic-ui-react";

const mainOrange = `#f79862`;

const Link = ({ url, text, style }) => (
  <a
    style={{ ...style, color: mainOrange }}
    target="_blank"
    rel="noopener noreferrer"
    href={url}
  >
    {text}
  </a>
);

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  @media only screen and (max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
  }
  @media only screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get("q");

  const initialSearch = myParam ? myParam : "";

  const [page, setPage] = useState(0);
  const [nbPages, setNbPages] = useState(1);
  const [results, setResults] = useState([]);
  const [searchText, setSearchText] = useState(initialSearch);
  const [loading, setLoading] = useState(false);

  console.log(results);

  useEffect(() => {
    const handleSearch = (searchText) => {
      setLoading(true);
      setPage(0);
      setNbPages(1);
      setResults([]);

      axios
        .get(
          `https://0h4smabbsg-dsn.algolia.net/1/indexes/Post_production?query=${searchText}&page=0&hitsPerPage=15`,
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

          console.log("fin");
          setLoading(false);
        });
    };

    handleSearch(initialSearch);
  }, [initialSearch]);

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
      style={{
        maxWidth: "1000px",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "1em",
      }}
    >
      <a style={{ color: "#f79862" }} href="/">
        <h1 style={{ display: "flex", alignItems: "center" }}>
          <img
            alt="logo"
            style={{ height: "2em", marginRight: "0.3em" }}
            src="/inline-logo.png"
          />{" "}
          <span>CleanHunt</span>
        </h1>
      </a>

      <br />
      <details style={{ color: mainOrange }}>
        <summary
          style={{ fontWeight: "bold", fontSize: "1.5em", marginBottom: "1em" }}
        >
          The Power of ProductHunt search without a Sea of Dead Links.
        </summary>
        Have you ever searched something on ProductHunt and faced difficulty
        while perusing, due to all the dead products? Introducing CleanHunt, a
        product which uses the existing ProductHunt API and discards those
        products from the results which don't have a live landing page. While
        not a perfect method to check for dead products, all startups which are
        no longer active don't pay their domain renewal fees, or don't host a
        webpage behind it. This is what we try to look for.
        <br />
        <br />
      </details>

      <form
        style={{ display: "flex", alignItems: "center", marginBottom: "1em" }}
        onSubmit={(e) => {
          e.preventDefault();
          document.location.href = `?q=${searchText}`;
        }}
      >
        <Input
          style={{ width: "90%" }}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search Here..."
          defaultValue={searchText}
          autofocus={true}
        >
          <input
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          />
        </Input>
        <Button
          style={{
            background: mainOrange,
            color: "white",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            height: 38,
          }}
          type="submit"
        >
          Search
        </Button>
      </form>
      <CardGrid>
        {results.map((result, index) => (
          <div
            style={{
              marginTop: "1em",
              marginBottom: "1em",
              boxShadow: "0 1px 4px 0 rgba(0,0,0,.1)",
              borderRadius: 8,
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              width: "90%",
              padding: "1em",
            }}
            key={index}
          >
            <img
              style={{ height: "80px" }}
              src={result.thumbnail.image_url.split("?")[0]}
              alt="Product"
            />
            <div style={{ fontSize: 20, margin: "1em 0" }}>{result.name}</div>

            <div
              style={{
                fontSize: 24,
                marginTop: "1em",
                marginBottom: "0.5em",
                color: mainOrange,
              }}
            >
              {result.vote_count}
            </div>
            <div
              style={{ fontSize: 18, marginBottom: "1em", color: "#6f6f6f" }}
            >
              POINTS
            </div>
            <div style={{ fontSize: 16 }}>
              <Link url={result.product_links[0].url} text={"View Product ⬈"} />
            </div>
            <div style={{ fontSize: 16 }}>
              <Link
                url={`https://www.producthunt.com${result.url}`}
                text={"View on PH ⬈"}
              />
            </div>
          </div>
        ))}
      </CardGrid>

      <div style={{ textAlign: "center" }}>
        {page < nbPages && !loading && results.length > 0 && (
          <>
            <Button
              style={{ background: mainOrange, color: "white" }}
              onClick={loadMore}
            >
              Load More
            </Button>
            <br />
            <br />
          </>
        )}
        {results.length === 0 && !loading && (
          <>
            <br />
            <span style={{ color: mainOrange }}>No Results.</span>
            <br />
            <br />
          </>
        )}
        {loading && (
          <>
            <br />
            <span style={{ color: mainOrange }}>Loading...</span>
            <br />
            <br />
          </>
        )}

        <Link
          style={{ textDecoration: "underline" }}
          url={"https://github.com/akash-joshi/clean-hunt"}
          text={"An Open Source Production"}
        />
      </div>
    </div>
  );
}

export default hot(module)(App);
