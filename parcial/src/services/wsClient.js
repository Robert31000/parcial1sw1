import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_ENDPOINT } from '../ConfigGlobal';

export const connectWS = (onConnect) => {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_ENDPOINT),
    reconnectDelay: 5000,
    onConnect,
  });
  client.activate();
  return client;
};
