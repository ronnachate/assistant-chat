import { MessageDTO } from '@assistant-chat/dtos';

function SystemMessage({ message }: { message: MessageDTO }) {
  return (
    <>
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
          <p className="small mb-0">{message.content}</p>
        </div>
      </div>
    </>
  );
}

export default SystemMessage;
