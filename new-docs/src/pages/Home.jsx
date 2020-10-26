import { makeStyles } from '@material-ui/styles';
import { Link, Playground } from 'docz';
import React from 'react';

const useStyles = makeStyles({
  root: {
    background: '#79b', 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center',
  },
})

const version = process.env.GATSBY_PAYBUTTON_VERSION;

const code = `\
<script src="https://unpkg.com/@paybutton/paybutton@${version}/dist/paybutton.js"></script>
<div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"></div>\
`;

export const Home = ( ) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>PayButton</div>
      <div style={{ paddingTop: 24 }}>
        <Link to="/start">Get Started</Link>
      </div>
      <div style={{ width: '100%', maxWidth: 720, textAlign: 'center' }}>
        <Playground
          language="html"
          __code={code} 
        />
      </div>
    </div>
  )
}

export default Home;