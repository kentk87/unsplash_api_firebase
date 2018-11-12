import React from 'react';
import { Container, Progress } from 'reactstrap'

const authedGet = (access_token, endpoint) => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Accept-Version': 'v1',
    'Authorization': `Bearer ${access_token}`
  }
  console.log( "headers", headers)
  const fetchInit = {
    method: 'GET',
    headers,
    credentials: 'omit',
  }
  return fetch("https://api.unsplash.com" + endpoint, fetchInit);
}

const Loading = () => {
  return (
    <Container>
      <h1>Fetching from the unsplash api</h1>
      <Progress animated color="primary" value={100}/>
    </Container>
  )
}

const Profile = ({user}) => {
  return (
    <Container>
      <h1>Hello {user.name}!</h1>
      <img src={user.profile_image.large} alt="profile photo"/>
    </Container>
  )
}

export default class Unsplash extends React.Component {
  state = {loading: true}

  componentDidMount() {
    const {access_token} = this.props;

    authedGet( access_token, "/me" ).then( (response) => {
      console.log( "Got response " + response.status_code)
      return response.json()
    }).then( (data) => {
      this.setState( {loading: false, user: data})
    })
  }
  render() {
    if( this.state.loading ) {
      return (<Loading/>)
    } else if ( this.state.user ) {
      return (<Profile user={this.state.user}/>)
    } else {
      return (<p>Horrible error</p>)
    }
  }
}
