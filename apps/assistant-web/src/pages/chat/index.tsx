import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
  MDBIcon,
  MDBTextArea,
  MDBBtn,
} from 'mdb-react-ui-kit';
import './chat.css';

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
              <div className="d-flex flex-row justify-content-start mb-4">
                <img
                  src="/assets/images/live-chat.png"
                  alt="avatar 1"
                  style={{ width: '45px', height: '100%' }}
                />
                <div
                  className="p-3 ms-3"
                  style={{
                    borderRadius: '15px',
                    backgroundColor: 'rgba(57, 192, 237,.2)',
                  }}
                >
                  <p className="small mb-0">
                    Hello and thank you for visiting MDBootstrap. Please click
                    the video below.
                  </p>
                </div>
              </div>

              <div className="d-flex flex-row justify-content-end mb-4">
                <div
                  className="p-3 me-3 border"
                  style={{ borderRadius: '15px', backgroundColor: '#fbfbfb' }}
                >
                  <p className="small mb-0">
                    Thank you, I really like your product.
                  </p>
                </div>
                <img
                  src="/assets/images/user.png"
                  alt="avatar 1"
                  style={{ width: '45px', height: '100%' }}
                />
              </div>

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
