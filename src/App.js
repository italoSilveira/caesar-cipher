import React, { Component } from "react";
import sha1 from 'js-sha1';
import axios, { post } from 'axios';

class App extends Component{
  constructor (props){
    super(props);

    this.state = {
      cell_number: 0,
      token: '',
      encrypted: '',
      decrypted: '',
      cryptographic_resume: '',
      alphabet: ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]

    };

    this.requestEncryptedMessage = this.requestEncryptedMessage.bind(this);
    this.decode = this.decode.bind(this);
    this.sendAnswer = this.sendAnswer.bind(this);
  }

  componentDidMount() {
    this.requestEncryptedMessage()
  }

  requestEncryptedMessage() {
    fetch("https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            cell_number: result.numero_casas,
            token: result.token,
            encrypted: result.cifrado,
            decrypted: result.decifrado,
            cryptographic_resume: result.resumo_criptografico
          });
          this.decode()
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  decode() {
    let state = this.state;
    let _ = this;
    let response = state.encrypted.split("").map((character) => {
      if (_.state.alphabet.includes(character)){
        return _.state.alphabet[_.state.alphabet.indexOf(character) - _.state.cell_number]
      }
      
      return character
    });
    state.decrypted = response.join('')
    
    state.cryptographic_resume = sha1(state.decrypted);
    this.setState(state)
  }

  sendAnswer = (event) => {
    let file = event.target.files[0];
    const url = 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=';
    const formData = new FormData();
    formData.append('answer',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return post(url, formData,config)
  }

  render(){
    return (
      <div>
        <p>Ceaser Cipher</p>
        <p>{this.state.decrypted}</p>
        <input type="file" id="file" name="file" onChange={this.sendAnswer}/>
      </div>
    );
  }
}

export default App;
