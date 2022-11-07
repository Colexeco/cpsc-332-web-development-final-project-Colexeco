import React, { useState } from 'react';
import './index.css';

export class Project extends React.Component {
    //const [task, setTasks] = useState([])

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