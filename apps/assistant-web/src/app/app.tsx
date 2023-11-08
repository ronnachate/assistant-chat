// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  return (
    <div>
      <NxWelcome title="Ronnachate Test Result" />
    </div>
  );
}

export default App;
