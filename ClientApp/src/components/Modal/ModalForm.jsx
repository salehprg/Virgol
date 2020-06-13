/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

export class ModalForm extends Component {
  render() {
    return (
        <Modal show={this.props.Show} onHide={this.props.handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.Title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {this.props.children}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => this.props.handleClose()}>
            {this.props.CloseText}
          </Button>

          {(this.props.ConfirmText != null || this.props.ConfirmText != "" ?
          <Button variant="primary" onClick={() => this.props.Confirm()}>
            {this.props.ConfirmText}
          </Button>
          : "")}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ModalForm;
