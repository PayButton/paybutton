import React from 'react';
import { Helmet } from 'react-helmet-async';

export const Wrapper = (props) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>The best way to accept Bitcoin Cash online</title>
      </Helmet>
      { props.children }
    </>
  );
}

Wrapper.componentName = Wrapper;

export default Wrapper;