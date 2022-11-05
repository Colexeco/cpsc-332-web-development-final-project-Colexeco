import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

export class Project extends React.Component {
    constructor(props) {
      super (props);
      this.state = {
        //deadline: 
      };
    }
  
    newProjectButton() {
      return (
        <button className = "newProject" onClick={() => {
          //TODO: add project button behavior
        }}>
          New Project...
        </button>
      )
    }
  };