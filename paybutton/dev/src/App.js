import './App.css';
import { PayButton } from '../../../react';

function App() {
  return (
    <div className="App">
      <PayButton
        to={`bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp`}
      />
    </div>
  );
}

export default App;
