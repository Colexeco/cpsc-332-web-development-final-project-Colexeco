import React from 'react';
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
      <textarea className="newProfile">Email</textarea>
      <textarea className="newProfile">Pasword</textarea>
      <form>
        <p>Upload a profile photo...</p>
        <input type="file" className="newProfile" accept="image/*" />
        <input type="submit" className="newProfile" onClick={ () => {
          root.render(<NewProject/>)
        }
        }/>
      </form>
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
      <button className = "NewProject" onClick={() => {
        //TODO: add project button behavior
        root.render(<Project/>)
      }}>
        New Project...
      </button>
    )
  }
};

class Project extends React.Component {
  constructor(props) {
    super (props);

    this.state = {
      showdata : this.displayData,
      postVal : ""
    };
  
  }
  
  render() {
    return (
      <>
      <textarea className="Project">
        Title
      </textarea>
      <textarea className="Project">
        Description
      </textarea>
      <p className="Project">Deadline</p>
      <input type="date" className="Project">
      </input>
      <button onClick={() => {
        root.render(
        <>
        <label for="date">Deadline: </label>
        <input type="date" name="date" className="Project"></input>

        <label for="description">Description: </label>
        <textarea name="Description" className="Project">Task</textarea>

        <label for="completed">Completed?</label>
        <input type="checkbox" name="completed" className="Project"></input>

        <button type="submit" className="Project">Save</button>
        </>
        )
      }}>Add task..</button>
      </>
    )
  }
};

class Container extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      //deadline: 
    };
  }
  render () {
    return (
    <fieldset className="Container">
      <legend>Project Management App</legend>
      <p>Sign up with an email to get started!</p>
      <p><button className = "newSignUp" onClick={() => {
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