// @ts-nocheck
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
import { MessageDTO } from '@assistant-chat/dtos';

const ChatMessage = ({ message }: { message: MessageDTO }) => {
  if (message.typeID === 1) {
    return <UserMessage message={message}/>;
  } else {
    console.log(message.typeID);
    return <SystemMessage message={message}/>;
  }
};

const Chat = () => {
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
              {mockData.items.map((message, i) => (
                <ChatMessage message={message} />
              ))}
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
};

export default Chat;

const mockData = {
  items: [
    {
      assistantID: 'c5e59baf-6c25-4f9f-a689-3e8505eed7f2',
      typeID: 1,
      content: 'hi from device1',
      createdAt: '2023-11-08T15:58:32.874Z',
    },
    {
      assistantID: 'c5e59baf-6c25-4f9f-a689-3e8505eed7f2',
      typeID: 2,
      content: 'Hello there, how may I assist you today?',
      createdAt: '2023-11-08T15:58:32.885Z',
    },
    {
      assistantID: 'c5e59baf-6c25-4f9f-a689-3e8505eed7f2',
      typeID: 1,
      content: 'hi from device1',
      createdAt: '2023-11-08T16:07:11.626Z',
    },
    {
      assistantID: 'c5e59baf-6c25-4f9f-a689-3e8505eed7f2',
      typeID: 2,
      content: 'Hello there, how may I assist you today?',
      createdAt: '2023-11-08T16:07:11.638Z',
    },
  ],
  pagination: {
    page: 1,
    rows: 10,
    count: 0,
  },
};
