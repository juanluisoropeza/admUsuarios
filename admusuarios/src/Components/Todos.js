import React, { Component } from 'react';
//import DatePicker from "react-datepicker";
import db from '../FirestoreConfig';
import { Table, Button, Row, Col, Input, Fade, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "react-datepicker/dist/react-datepicker.css";

export default class Todos extends Component {
  state = {
    items: [],
    inputNombre: '',
    inputSexo: '',
    inputfechaNac: '',
    sexoChecked: false,
    edit: false,
    id: '',
    fadeIn: false,
    message: ''
  }

  constructor(props) {
    super(props);
    
    this.fnacChange = this.fnacChange.bind(this);
    this.toggle = this.toggle.bind(this);
    var curr = new Date();
    curr.setDate(curr.getDate() + 3);
    var date = curr.toISOString('/').substr(0,10);

    this.state = {
      modal: false,
      edit: false,
      inputfechaNac: date
    };
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }  

  componentDidMount() {
    db.collection('todos').onSnapshot((snapShots) => {
      this.setState({
        items:snapShots.docs.map(doc => {
          //console.log(doc.data());
          return {id:doc.id, data:doc.data()}
        })
      })
    });
  }

  nombreValue = (e) => {
    this.setState({
      inputNombre:e.target.value
    })
  }

  emailValue = (e) => {
    this.setState({
      inputEmail:e.target.value
    })
  }

  fnacValue = (e) => {
    this.setState({
      inputfechaNac:e.target.value
    })
  }

  radioSexo = (e) => {
    const {inputSexo} = this.state;
    if(e.target.value !== inputSexo) {
      this.setState({
        sexoChecked:false
      })      
    } else {
      this.setState({
        sexoChecked:true
      })
    }
    this.setState({
      inputSexo:e.target.value
    });
  }

  action = () => {
    this.toggle();
    this.setState({
      edit:false
    });  
  }

  agregarNuevo() {
    const {inputNombre,inputSexo,inputfechaNac,inputEmail} = this.state;
    db.collection('todos').add({
      nombre: inputNombre,
      sexo: inputSexo,
      edad: inputfechaNac,
      email: inputEmail
    }).then(() => {
      this.message('Agregado');
      this.toggle();
    }).catch((error) => {
      this.message('Error');
    });
  }

  calcAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getTodo = (id) => {
    this.toggle();
    let docRef = db.collection("todos").doc(id);
    docRef.get().then((doc) => {
      if(doc.exists) {
        this.setState({
          inputNombre:doc.data().nombre,
          inputfechaNac:doc.data().edad,
          inputSexo:doc.data().sexo,
          inputEmail:doc.data().email,
          sexoChecked: false,
          edit:true,
          id:doc.id
        });
      } else {
        console.log('El documento no existe');
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  update = () => {
    const {id,inputNombre,inputSexo,inputEmail,inputfechaNac} = this.state;
    db.collection('todos').doc(id).update({
      nombre: inputNombre,
      sexo: inputSexo,
      email: inputEmail,
      edad: inputfechaNac
    }).then(() => {
      this.setState({
        edit:false
      });
      this.toggle();
      this.limpiarInputs();
      this.message('Actualizado');
    }).catch((error) => {
      this.message('Error');
    });
  }

  limpiarInputs() {
    this.setState({
      inputNombre: '',
      inputSexo: '',
      inputfechaNac: '',
      inputEmail: '',
      sexoChecked: false,
      edit: false,
      id: '',
      message: ''
    });
  }

  deleteItem = (id) => {
    db.collection('todos').doc(id).delete();
    this.message('Eliminado');
  }

  message = (message) => {
    this.setState({
      fadeIn:true,
      message: message
    });
    setTimeout(() => {
      this.setState({
        fadeIn:false,
        message: ''
      })
    }, 3000);
  }

  fnacChange = (e) => {
    this.setState({
      inputfechaNac:e.target.value
    })
  }  

  render() {
    const { items, inputNombre, inputfechaNac, inputEmail, sexoChecked } = this.state;
    return(
      <div>
        <Row>
          <Col xs="12">
            <div className="text-right">
              <Button color="success" onClick={this.action}>Agregar <FontAwesomeIcon icon="plus" /></Button>
            </div>
          </Col>
        </Row>
        <Fade in={this.state.fadeIn} tag="h6" className="mt-3 text-center text-success">
          {this.state.message}
        </Fade>
        <br/>
        <Table hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Sexo</th>
              <th>Email</th>
              <th width="12%">Acciones</th>
            </tr>
          </thead>
          <tbody>
            { items && items !== undefined ? items.map((item, key)=> (
              <tr key={key}>
                <td>{item.data.nombre}</td>
                <td>{this.calcAge(item.data.edad)}</td>
                <td>{item.data.sexo}</td>
                <td>{item.data.email}</td>
                <td>
                  <Button color="primary" className="mr-2" onClick={() => this.getTodo(item.id)}>
                    <FontAwesomeIcon icon="edit" />
                  </Button>
                  <Button color="danger" onClick={() => { if (window.confirm('Esta seguro de eliminar este elemento?')) this.deleteItem(item.id) }}>
                    <FontAwesomeIcon icon="trash-alt" />
                  </Button>
                </td>
              </tr>
            )):null}
          </tbody>
        </Table>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.state.edit ? 'Editar' : 'Agregar'}</ModalHeader>
          <ModalBody>
            <form>
              <FormGroup>
                <Label for="txt_nombre">Nombre</Label>
                <Input placeholder="Nombre" id="txt_nombre" value= {inputNombre} onChange = {this.nombreValue} />
              </FormGroup>              
              <FormGroup>
                <Label for="txt_fnac" className="d-block">Fecha de Nacimiento</Label>                
                <input id="dateRequired" type="date" name="dateRequired" value={inputfechaNac} onChange = {this.fnacChange} /> 
              </FormGroup>   
              <FormGroup tag="fieldset">
                <Label for="txt_sexo">Sexo</Label>
                <FormGroup check >
                  <Label check>
                    <Input type="radio" name="radio1" value="Femenino" checked={sexoChecked} onChange={this.radioSexo}/>{' '}
                    Femenino
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="radio1" value="Masculino" checked={sexoChecked} onChange={this.radioSexo}/>{' '}
                    Masculino
                  </Label>
                </FormGroup>
              </FormGroup>
              <FormGroup>
                <Label for="txt_email">Email</Label>
                <Input placeholder="Email" id="txt_email" value= {inputEmail} onChange = {this.emailValue} />
              </FormGroup>
            </form> 
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={ !this.state.edit ? () => this.agregarNuevo() : () => this.update()}>Guardar</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
      
    );
  }
}