import React from 'react';

import {querySimulationEngine} from './service';
import Main from './Main';

const App: () => React$Node = () => {
  return (
    <>
      <Main querySimulationEngine={querySimulationEngine} />
    </>
  );
};

export default App;
