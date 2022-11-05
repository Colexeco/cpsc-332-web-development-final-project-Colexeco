import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

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
      <p>{newSignUpButton()}</p>
    </fieldset>
    );
  }
}

function newProjectButton() {
  return (
    <button className = "newProject" onClick={() => {
      //TODO: add project button behavior
    }}>
      New Project...
    </button>
  )
}

function newProfilePhotoButton() {
  return (
    <button className = "newProfilePhoto" onClick={() => {
      //TODO: add profile photo button behavior
    }}>
      New Profile Photo...
    </button>
  )
}

function newSignUpButton() {
  return (
    <button className = "newSignUp" onClick={() => {
      //TODO: add sign up button behavior
    }}>
      Sign Up
    </button>
  )
}

class Project extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      //deadline: 
    };
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Container />);