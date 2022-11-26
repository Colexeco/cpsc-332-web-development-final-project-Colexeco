import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Profile extends React.Component{
  //referenced the following to understand rendering components: 
  //https://stackoverflow.com/questions/33840150/onclick-doesnt-render-new-react-component
  constructor(props) {
      super (props);
      this.state = {
        showComponent: false,
      };
      this._newProfilePhotoButton = this._newProfilePhotoButton.bind(this);
    }

    _newProfilePhotoButton() {
      this.setState({
        showComponent: true,
      });
    }

  render() {
    return (
      <>
      <div className="page-wrap">
      <form>
      <div>
      <label htmlFor="Email">Email</label>
      <input id="Email" type="text"/>
      </div>
      <div>
      <label htmlFor="Password">Password</label>
      <input id="Password" type="text"/>
      </div>
      <p>Upload a profile photo...</p>
      <input type="file" accept="image/*" />
      <input className="button" type="submit" onClick={ () => {
        root.render(<NewProject/>)
      }
      }/>
      </form>
      </div>
      </>
    )
  }
};

class NewProject extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      //deadline: 
    };
  }
  
  render() {
    return (
      <div className="page-wrap">
      <button className="button" onClick={() => {
        //TODO: add project button behavior
        root.render(<Project/>)
      }}>
        New Project...
      </button>
      </div>
    )
  }
};

class Project extends React.Component {
  constructor(props) {
    super (props);

    this.state = {
      showdata : this.displayData,
      postVal : "",
      Deadline : "",
      Title : "",
      Description : "",
    };
  
  }
  
  render() {
    return (
      <>
      <div className="page-wrap">
      <textarea>
        Title
      </textarea>
      <textarea>
        Description
      </textarea>
      <p>Deadline</p>
      <input type="date">
      </input>
      <button onClick={() => {
      root.render(
      <>
      <div className="page-wrap">
      <label className="input" for="date">Deadline: </label>
      <input className="input" type="date" name="date"></input>

      <label className="input" for="Description">Description: </label>
      <input type="text" className="input" name="Description"/>

      <label className="input" for="completed">Completed?</label>
      <input className="input" type="checkbox" name="completed"/>

      <button className="button" type="submit" onClick={() => {root.render(<Project/>)}}>Save</button>
      </div>
        </>
        )
      }}>Add task..</button>
      </div>
      </>
    )
  }
};

class Container extends React.Component {
  constructor(props) {
    super (props);
    this.state = { apiResponse: "" };
  }
  //the 2 methods below are from
  //https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/
  callAPI() {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }))
        .catch(err => err);
  }

  componentDidMount() {
    this.callAPI();
  }

  render () {
    return (
    <fieldset className="page-wrap">
      <legend>Project Management App</legend>
      <p>Sign up with an email to get started!</p>
      <p>{this.state.apiResponse}</p>
      <p><button className="button" onClick={() => {
        root.render(<Profile/>)
      }}>
            Sign Up
          </button></p>
    </fieldset>
    );
  }

}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Container/>);