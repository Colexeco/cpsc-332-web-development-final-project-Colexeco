import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

  export class Profile extends React.Component{
    constructor(props) {
        super (props);
        this.state = {
          email: "",
          password: "",
          profilePhoto: null 
        };
      }
    
      newSignUpButton() {
        return (
          <button className = "newSignUp" onClick={() => {
          }}>
            Sign Up
          </button>
        )
      }
    
      newProfilePhotoButton() {
        return (
          <button className = "newProfilePhoto" onClick={() => {
            //TODO: add profile photo button behavior
          }}>
            New Profile Photo...
          </button>
        )
      }
  };