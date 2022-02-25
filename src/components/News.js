import React, { Component } from "react";
import { NewsItem } from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export default class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "sports",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )} - News Monkey`;
  }

  async updateNews() {
    this.props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(70);
    let parseData = await data.json();

    this.setState({
      totalResults: parseData.totalResults,
      articles: parseData.articles,
      loading: false,
    });
    this.props.setProgress(100);
  }

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    let data = await fetch(url);
    let parseData = await data.json();

    this.setState({
      totalResults: parseData.totalResults,
      articles: this.state.articles.concat(parseData.articles),
      loading: false,
    });
  };

  async componentDidMount() {
    this.updateNews();
  }
  render() {
    return (
      <div className=" container my-3">
        <h1 className="text-center my-5">
          Top {`${this.capitalizeFirstLetter(this.props.category)}`} Headlines
        </h1>
        {this.state.loading && (
          <div className="text-center">
            <Spinner />
          </div>
        )}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          style={{ overflowX: "hidden" }} //To put endMessage and loader to the top.
          // inverse={true} //
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={
            <div className="text-center">
              <Spinner />
            </div>
          }
          // scrollableTarget="scrollableDiv"
        >
          <div className="row">
            {this.state.articles.map((element) => {
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
  }
}
