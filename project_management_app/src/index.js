import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Profile} from './Profile.js'
import {Project} from './Project.js'

class Container extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      //TODO: Add profile photo, username, password
    };
  }

  render () {
    return (
    <fieldset className="Container">
      <legend>Project Management App</legend>
      <p>Sign up with an email to get started!</p>
      <p>{/*Profile.newSignUpButton()*/}</p>
    </fieldset>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Container><Profile/></Container>);