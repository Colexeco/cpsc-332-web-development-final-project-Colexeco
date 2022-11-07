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
          root.render(<Project/>)
        }
        }/>
      </form>
      </>
    )
  }
};

class Project extends React.Component {
  //const [task, setTasks] = useState([])

  constructor(props) {
    super (props);
    this.state = {
      //deadline: 
    };
  }
  
  render() {
    return (
      <button className = "newProject" onClick={() => {
        //TODO: add project button behavior
      }}>
        New Project...
      </button>
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