import React, { Component } from 'react';
import QueryString from 'query-string'
import { Jumbotron, Container } from 'reactstrap';
import Unsplash from './Unsplash'

const LoginWindow = (props) => {
  return (
    <Jumbotron>
      <Container>
        <h1 className="display-3">Unsplash browser</h1>
        <p className="lead">This is an example of how to do something amazing</p>
        <p><a className="btn btn-primary" href={process.env.REACT_APP_BASE_URL + "/auth"}>Connect</a></p>
      </Container>
    </Jumbotron>
  )
}

class App extends Component {
  state = {access_token:null}

  componentDidMount() {
    const values = QueryString.parse(window.location.search)

    if( values.access_token !== undefined ){
      console.log( "looks like we've got an access_token!", values.access_token )
      this.setState( {...this.state, access_token: values.access_token } )
    } else {
      console.log( "No token")
    }
  }
  render() {
    if( this.state.access_token ) {
      return <Unsplash access_token={this.state.access_token}/>
    } else {
      return (
        <LoginWindow/>
      );
    }
  }
}

export default App;
