function UserMessage() {
  return (
    <>
      <div className="d-flex flex-row justify-content-end mb-4">
        <div
          className="p-3 me-3 border"
          style={{ borderRadius: '15px', backgroundColor: '#fbfbfb' }}
        >
          <p className="small mb-0">Thank you, I really like your product.</p>
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
