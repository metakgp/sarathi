import React from 'react'
import { Redirect } from 'react-router-dom';

export default function LoginRedirector(props) {
  const redirectUrl = window.localStorage.getItem('redirectUrl');
  window.localStorage.removeItem('redirectUrl');
  return (
      <Redirect to={redirectUrl ? redirectUrl : '/'} />
  )
}