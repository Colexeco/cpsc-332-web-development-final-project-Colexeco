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
    <button className = "newProject" onClick={() => {
      //TODO: implement create new project button
    }}>
      New Project
    </button>
    );
  }
}

function newProject(props) {
  return (
    <button className = "newProject" onClick={() => {
      //TODO: implement create new project button
    }}>
      New Project
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