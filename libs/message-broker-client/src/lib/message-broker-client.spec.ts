import { messageBrokerClient } from './message-broker-client';

describe('messageBrokerClient', () => {
  it('should work', () => {
    expect(messageBrokerClient()).toEqual('message-broker-client');
  });
});
