import React, { Component } from  'react';
import config from '../config'
import './EditBookmark.css';
import BookmarksContext from '../BookmarksContext';

const Required = () => (
  <span className='EditBookmark__required'>*</span>
)

class EditBookmark extends Component {
  static contextType = BookmarksContext

  state = {
    error: null,
    id: '',
    title: '',
    url: '',
    description: '',
    rating: 1,
  };

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/${this.props.match.params.bookmarkId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(bookmark => {
        this.setState({
          id: bookmark.id,
          title: bookmark.title,
          url: bookmark.url,
          description: bookmark.description,
          rating: bookmark.rating
        })
      })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { id, title, url, description, rating } = this.state
    const bookmark = {
      id, 
      title,
      url,
      description,
      rating
    }
    this.setState({ error: null })
    fetch(`${config.API_ENDPOINT}/${bookmark.id}`, {
      method: 'PATCH',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.API_KEY}`
      }
    })
    .then(res => {
      if(!res.ok)
        return res.json().then(error => Promise.reject(error))
    })
    .then(() => {
      this.resetFields(bookmark)
      this.context.updateBookmark(bookmark)
      this.props.history.push('/')
    })
    .catch(error => {
      console.error(error)
      this.setState({ error })
    })
  }

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || '',
    })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  }

  

  render() {
    const { error } = this.state
    return (
      <section className='EditBookmark'>
        <h2>Edit bookmark</h2>
        <form
          className='EditBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              value={this.state.title}
              onChange={e => this.setState({title: e.target.value})}
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder='https://www.great-website.com/'
              value={this.state.url}
              onChange={e => this.setState({url: e.target.value})}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={this.state.description}
              onChange={e => this.setState({description: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              value={this.state.rating}
              onChange={e => this.setState({rating: e.target.value})}
              min='1'
              max='5'
              required
            />
          </div>
          <div className='EditBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
