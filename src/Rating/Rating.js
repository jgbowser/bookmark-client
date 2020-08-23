import React from 'react';
import './Rating.css';
import PropTypes from 'prop-types'

export default function Rating(props) {

  Rating.defaultProps = {
    value: 1,
  }

  Rating.propTypes = {
    value: PropTypes.number.isRequired
  }

  const stars = [0, 0, 0, 0, 0].map((_, i) =>
    (i < props.value)
      ? <span key={i}>&#9733; </span>
      : <span key={i}>&#9734; </span>
  );
  return (
    <div className="rating">
      {stars}
    </div>
  );
}