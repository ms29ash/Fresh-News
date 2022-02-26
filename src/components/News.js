import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  const updateNews = async () => {
    props.setProgress(0);

    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parseData = await data.json();
    props.setProgress(70);

    setArticles(parseData.articles);
    setTotalResults(parseData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };

  const fetchMoreData = async () => {
    setPage(page + 1);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country
      }&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1
      }&pageSize=${props.pageSize}`;
    setPage(page + 1);

    let data = await fetch(url);
    let parseData = await data.json();
    setArticles(articles.concat(parseData.articles));
    setTotalResults(parseData.totalResults);

    // this.setState({
    //   totalResults: parseData.totalResults,
    //   articles:  articles.concat(parseData.articles),
    //   loading: false,
    // });
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(
      props.category
    )} - News Monkey`;

    updateNews();
    //  eslint-disable-line
  }, []);

  return (
    <div className=" container my-3 ">
      <h1 className="text-center " style={{ marginTop: "90px" }}>
        Top {capitalizeFirstLetter(props.category)}Headlines
      </h1>
      {loading && (
        <div className="text-center">
          <Spinner />
        </div>
      )}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        style={{ overflowX: "hidden" }} //To put endMessage and loader to the top.
        // inverse={true} //
        hasMore={articles.length !== totalResults}
        loader={
          <div className="text-center">
            <Spinner />
          </div>
        }
      // scrollableTarget="scrollableDiv"
      >
        <div className="row">
          {articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title}
                  description={element.description}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "sports",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
