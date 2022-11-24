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
      <div className="page-wrap">
      <textarea>Email</textarea>
      <textarea>Pasword</textarea>
      <form>
      <p>Upload a profile photo...</p>
      <input type="file" accept="image/*" />
      <input type="submit" onClick={ () => {
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
      <button onClick={() => {
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
      postVal : ""
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
      <label for="date">Deadline: </label>
      <input type="date" name="date"></input>

      <label for="description">Description: </label>
      <textarea name="Description">Task</textarea>

      <label for="completed">Completed?</label>
      <input type="checkbox" name="completed"></input>

      <button type="submit">Save</button>
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
    this.state = {
      //deadline: 
    };
  }
  render () {
    return (
    <fieldset className="page-wrap">
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