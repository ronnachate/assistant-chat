import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBIcon,
  MDBTextArea,
  MDBBtn,
} from 'mdb-react-ui-kit';
import './chat.css';
import SystemMessage from '../../components/SystemMessage';
import UserMessage from '../../components/UserMessage';

function Chat() {
  return (
    <MDBContainer className="py-5">
      <MDBRow className="d-flex justify-content-center">
        <MDBCol md="8" lg="8" xl="8">
          <MDBCard id="chat1" style={{ borderRadius: '15px' }}>
            <MDBCardHeader
              className="d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0"
              style={{
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px',
              }}
            >
              <MDBIcon fas icon="angle-left" />
              <p className="mb-0 fw-bold">Live chat</p>
              <MDBIcon fas icon="times" />
            </MDBCardHeader>

            <MDBCardBody>
              <SystemMessage />

              <UserMessage />

              <MDBTextArea
                className="form-outline mt-5"
                label="Type your message"
                id="textAreaExample"
                rows={4}
              />
              <MDBRow className="d-flex justify-content-end">
                <MDBCol md="3" lg="3" xl="3">
                  <MDBBtn className="mt-3 btn-info">Send</MDBBtn>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Chat;