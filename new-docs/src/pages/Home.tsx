import { makeStyles } from '@material-ui/styles';
import { Link } from 'docz';
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


export const Home = ( ) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>PayButton</div>
      <div style={{ paddingTop: 24 }}>
        <Link to="/start">Get Started</Link>
      </div>
    </div>
  )
}

export default Home;