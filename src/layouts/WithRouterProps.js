// withRouterProps.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const withRouterProps = WrappedComponent => {
  return props => {
    const location = useLocation(); // Move this line inside a functional component
    return <WrappedComponent {...props} location={location} />;
  };
};

export default withRouterProps;
