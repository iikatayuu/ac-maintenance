
import React from 'react';
import './style.scss';

class NotFound extends React.Component {
  render () {
    return (
      <div className="notfound box">
        <h2>Page Not Found</h2>
        <p>The page you&apos;re trying to access is not found on the server.</p>
      </div>
    );
  }
}

export default NotFound;
