// @ts-nocheck
import React, { useEffect, useState } from 'react';
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
import { getAssistantID } from '../../services/assistantService';
import { getMessages, newMessages } from '../../services/messageService';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [assistantID, setAssistantID] = useState('');

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const messageAssistantID = await getAssistantID();
        setAssistantID(messageAssistantID);
        const messagesResult = await getMessages(messageAssistantID);
        if (isMounted) {
          setMessages(messagesResult.items);
        }
      } catch (err) {
        alert(`failed to load messages: ${err}`);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSend = () => {
    (async () => {
      const newMessage = {
        assistantID: assistantID,
        typeID: 1,
        content: message,
        createdAt: new Date().toISOString(),
      };
      const beforeSentList = [...messages];
      beforeSentList.push(newMessage);
      setMessages(beforeSentList);
      setMessage('');
      //send to api then add to messages
      var reponseMessage = await newMessages(assistantID, message);
      if (reponseMessage.error) {
        alert('error while sending message');
      } else {
        const afterSentList = [...beforeSentList];
        afterSentList.push(reponseMessage);
        setMessages(afterSentList);
      }
    })();
  };
  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };
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
              {messages.map((message: MessageDTO, i) => (
                <React.Fragment key={i}>
                  {message.typeID === 1 ? (
                    <UserMessage message={message} />
                  ) : (
                    <SystemMessage message={message} />
                  )}
                </React.Fragment>
              ))}
              <MDBTextArea
                className="form-outline mt-5"
                label="Type your message"
                onChange={handleInputChange}
                value={message}
                rows={4}
              />
              <MDBRow className="d-flex justify-content-end">
                <MDBCol md="3" lg="3" xl="3">
                  <MDBBtn className="mt-3 btn-info" onClick={handleSend}>
                    Send
                  </MDBBtn>
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
