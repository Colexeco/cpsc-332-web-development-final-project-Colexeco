import React from 'react';
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