import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios'
import './LoginForm.css'

export class UserLogin extends Component {

  state = {
    email: '',
    password: ''
  }

  handleLoginChange = e => {
    this.setState({ [e.target.name]: e.target.value})
  }

  handleLoginSubmit = async e => {
    e.preventDefault()
    await axios.post('/api/auth/login', this.state)
    this.props.userLoggedIn()
  }

  render() {
    const { message } = this.props;
    return (
        <div id='main-login'>
          <form onSubmit={this.handleLoginSubmit} id='login-form'>
            <h1>
              <i className="fas fa-sign-in-alt"></i>
              Login
            </h1>

            <label htmlFor="email">
              Email
            </label>
            <input onChange={this.handleLoginChange} type="email" name="email" className="form-control" />

            <label htmlFor="password">
              Password
            </label>
            <input onChange={this.handleLoginChange}
              type="password"
              name="password"
              className="form-control"
              placeholder="**********"
            />

            <button to='/login' type="submit">
              Login
            </button>

            <p>
              Don't have an account?
              <Link to='/'>Sign up</Link>
            </p>
          </form>
          {message ? <div className="error-message">{ message}</div> : ''}
        </div>
    );
  }
}

export default UserLogin;
