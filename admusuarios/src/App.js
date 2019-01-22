import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Title from './Components/Title';
import Todos from './Components/Todos';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

library.add(faEdit,faTrashAlt,faPlus)

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Title/>
          <Todos/>
        </Container>
      </div>
    );
  }
}

export default App;
