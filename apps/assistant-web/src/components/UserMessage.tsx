import { MessageDTO } from '@assistant-chat/dtos';

function UserMessage({ message }: { message: MessageDTO }) {
  return (
    <>
      <div className="d-flex flex-row justify-content-end mb-4">
        <div
          className="p-3 me-3 border"
          style={{ borderRadius: '15px', backgroundColor: '#fbfbfb' }}
        >
          <p className="small mb-0">{message.content}</p>
        </div>
        <img
          src="/assets/images/user.png"
          alt="avatar 1"
          style={{ width: '45px', height: '100%' }}
        />
      </div>
    </>
  );
}

export default UserMessage;
