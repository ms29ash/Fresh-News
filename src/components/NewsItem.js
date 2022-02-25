import React, { Component } from 'react'

export class NewsItem extends Component {

  render() {
    let { title, description, imageUrl, newsUrl, author, date,source } = this.props;
    return (
      <div className="my-3">
        <div className="card" >
          <img src={imageUrl} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <div className="flex justify-content-end position-absolute top-0 end-0">
            <span className=" badge rounded-pill bg-danger " >
          
              {source}
              </span>
              </div>
              <p className="card-text">{description}</p>
              <p className="card-text"><small className="text-muted">By {author ? author : 'unkonwn'} on {new Date(date).toString()}</small></p>
              <a href={newsUrl} rel="noreferrer" target="_blank" className="btn  btn-dark btn-sm">Read More</a>
          </div>

        </div>

      </div>
    )
  }
}
