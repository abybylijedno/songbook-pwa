import { useSessionStore } from './store';
import { useOptionsStore } from '@/stores/options';
import { bus } from '@/services/event-bus';

import {
  Message,
  type IErrorMessage,
  type IHelloResponse,
  type ISessionDetails,
  type ISessionDeleted,
  type ICurrentSongVerse,

  Command,
  SessionDeleteReason
} from "@abybylijedno/songbook-protocol";
import { getUid, setUid } from "./cookie";
import { getErrorText } from './errors';
import pDefer, { type DeferredPromise } from 'p-defer';


export class ConnectionCommander {
  private socket?: WebSocket;
  private lastSentCommand?: Command;
  
  private promiseHello?: DeferredPromise<string>;
  private promiseSessionCreate?: DeferredPromise<ISessionDetails>;
  private promiseSessionDelete?: DeferredPromise<void>;
  private promiseSessionJoin?: DeferredPromise<ISessionDetails>;
  private promiseSessionLeave?: DeferredPromise<void>;


  constructor() {
  }

  /**
   * Connect to the session server
   */
  connect() {
    const optionsStore = useOptionsStore();
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    this.socket = new WebSocket(`${protocol}//${optionsStore.sessionServer}/ws`);
    this.socket.binaryType = "arraybuffer";
    
    this.updateConnectionState();

    this.socket.onopen = () => {
      this.updateConnectionState();
      console.debug('Connected');

      this.handshake(optionsStore.sessionUsername).then(() => {
        console.info('Handshake completed');
      });
    };

    this.socket.onclose = () => {
      this.updateConnectionState();
      console.debug('Disconnected');
    };

    this.socket.onerror = (e) => {
      console.error(e);
    };

    this.socket.onmessage = (e) => {
      this.handleMessage(new Uint8Array(e.data));
    };
  }

  /**
   * Disconnect from the session server
   */
  disconnect() {
    if (!this.socket) {
      return;
    }

    this.socket.close();
  }

  /**
   * Perform the handshake with the session server
   * 
   * @param name Username
   */
  async handshake(name: string): Promise<string> {
    const sessionStore = useSessionStore();

    this.promiseHello = pDefer();    
    this.promiseHello.promise.then((uid) => {
      setUid(uid);
      sessionStore.handshakeSuccessful = true;
    }).catch(() => {
      sessionStore.handshakeSuccessful = false;
    });

    this.sendHelloRequest(name);

    return this.promiseHello.promise;
  }

  /**
   * Create a new session
   */
  async sessionCreate(): Promise<ISessionDetails> {
    this.promiseSessionCreate = pDefer();
    this.promiseSessionCreate.promise.then((session) => {
      console.debug('Session created', session);
    }).catch(() => {
      console.error('Failed to create session');
    });

    this.sendSessionCreate();

    return this.promiseSessionCreate.promise;
  }

  /**
   * Delete the current session
   */
  async sessionDelete(): Promise<void> {
    this.promiseSessionDelete = pDefer();
    this.promiseSessionDelete.promise.then(() => {
      console.debug('Session deleted');
    }).catch(() => {
      console.error('Failed to delete session');
    });

    this.sendSessionDelete();

    return this.promiseSessionDelete.promise;
  }

  /**
   * Join an existing session
   * 
   * @param id Session ID 
   * @returns 
   */
  async sessionJoin(id: string): Promise<ISessionDetails> {
    this.promiseSessionJoin = pDefer();
    this.promiseSessionJoin.promise.then((session) => {
      console.debug('Session joined', session);
    }).catch(() => {
      console.error('Failed to join session');
    });

    this.sendSessionJoin(id);

    return this.promiseSessionJoin.promise;
  }

  /**
   * Leave the current session
   */
  async sessionLeave(): Promise<void> {
    this.promiseSessionLeave = pDefer();
    this.promiseSessionLeave.promise.then(() => {
      console.debug('Session left');
    }).catch(() => {
      console.error('Failed to leave session');
    });

    this.sendSessionLeave();

    return this.promiseSessionLeave.promise;
  }

  /**
   * Update the connection state in the session store
   */
  private updateConnectionState() {
    if (!this.socket) {
      return;
    }

    const sessionStore = useSessionStore();
    sessionStore.connectionState = this.socket.readyState;
  }

  /**
   * Handle a message from the session server
   * 
   * @param msg Message
   */
  private handleMessage(msg: Uint8Array) {
    const message = Message.decode(msg);
  
    if (message.isErrorMessage()) {
      this.handleErrorMessage(message.data.value as IErrorMessage);
      return;

    } else if (message.isHelloResponse()) {
      this.handleHelloResponse(message.data.value as IHelloResponse);
      return;

    } else if (message.isSessionDetails()) {
      this.handleSessionDetails(message.data.value as ISessionDetails);
      return;

    } else if (message.isSessionDeleted()) {
      this.handleSessionDelated(message.data.value as ISessionDeleted);
      return;

    } else if (message.isCurrentSongVerse()) {
      this.handleCurrentSongVerse(message.data.value as ICurrentSongVerse);
      return;

    } else {
      console.error('Unknown message type');
    }
  }

  /**
   * Handle an error message
   * 
   * @param message Error message
   */
  private handleErrorMessage(message: IErrorMessage) {
    console.debug(`Received error ${message.code}`);

    if (this.lastSentCommand?.isHelloRequest()) {
      if (this.promiseHello) {
        this.promiseHello.reject(getErrorText(message.code));
      }

    } else if (this.lastSentCommand?.isSessionCreate()) {
      if (this.promiseSessionCreate) {
        this.promiseSessionCreate.reject(getErrorText(message.code));
      }

    } else if (this.lastSentCommand?.isSessionDelete()) {
      if (this.promiseSessionDelete) {
        this.promiseSessionDelete.reject(getErrorText(message.code));
      }

    } else if (this.lastSentCommand?.isSessionJoin()) {
      if (this.promiseSessionJoin) {
        this.promiseSessionJoin.reject(getErrorText(message.code));
      } 
    
    } else if (this.lastSentCommand?.isSessionLeave()) {
      if (this.promiseSessionLeave) {
        this.promiseSessionLeave.reject(getErrorText(message.code));
      }

    }

  }

  /**
   * Handle a HelloResponse message
   * 
   * @param message HelloResponse message
   */
  private handleHelloResponse(message: IHelloResponse) {
    console.debug('Received HelloResponse');

    if (this.lastSentCommand?.isHelloRequest()) {
      if (this.promiseHello) {
        this.promiseHello.resolve(message.uid);
      }

    } else {
      console.error('Unexpected HelloResponse');

    }


  }

  /**
   * Handle a SessionDetails message
   * 
   * @param message SessionDetails message
   */
  private handleSessionDetails(message: ISessionDetails) {
    console.debug('Received SessionDetails');

    if (this.lastSentCommand?.isSessionCreate()) {
      if (this.promiseSessionCreate) {
        this.promiseSessionCreate.resolve(message);
      }

    } else if (this.lastSentCommand?.isSessionJoin()) {
      if (this.promiseSessionJoin) {
        this.promiseSessionJoin.resolve(message);
      }

    }

    const sessionStore = useSessionStore();
    sessionStore.sessionDetails = message;
  }

  /**
   * Handle a SessionDeleted message
   * 
   * @param message SessionDeleted message
   */
  private handleSessionDelated(message: ISessionDeleted) {
    console.debug('Received SessionDeleted');

    if (this.lastSentCommand?.isSessionDelete()) {
      if (this.promiseSessionDelete) {
        this.promiseSessionDelete.resolve();
      }

    } else if (this.lastSentCommand?.isSessionLeave()) {
      if (this.promiseSessionLeave) {
        this.promiseSessionLeave.resolve();
      }

    } else if (message.reason === SessionDeleteReason.CreatorsDecision) {
      console.info('Session was deleted by the creator');
      bus.emit('session-deleted');

    } else if (message.reason === SessionDeleteReason.Expired) {
      console.info('Session has expired');
      bus.emit('session-expired');
      
    } else {
      console.error('Unexpected SessionDeleted', message.reason);
    }

    const sessionStore = useSessionStore();
    sessionStore.sessionDetails = null;
  }

  /**
   * Handle a CurrentSongVerse message
   * 
   * @param message CurrentSongVerse message
   */
  private handleCurrentSongVerse(message: ICurrentSongVerse) {
    console.debug('Received CurrentSongVerse');
    console.log(message); // TODO: Handle the message
  }


  
  /**
   * Send a command to the session server
   *
   * @param type Command type
   * @param data Command data
   */
  private sendCommand(command: Command) {
    if (!this.socket) {
      return;
    }

    this.socket.send(command.encode());
    this.lastSentCommand = command;
  }
  
  /**
   * Send a HelloRequest command
   * This is the handshake initialization command
   */
  private sendHelloRequest(name: string) {
    console.debug('Sending HelloRequest');
    this.sendCommand(Command.fromHelloRequest({
      name,
      uid: getUid()
    }));
  }
  
  /**
   * Send a SessionCreate command
   * This command creates a new session
   */
  private sendSessionCreate() {
    console.debug('Sending SessionCreate');
    this.sendCommand(Command.fromSessionCreate({}));
  }

  /**
   * Send a SessionDelete command
   * This command deletes the current session
   */
  private sendSessionDelete() {
    console.debug('Sending SessionDelete');
    this.sendCommand(Command.fromSessionDelete({}));
  }

  /**
   * Send a SessionJoin command
   * This command joins an existing session
   */
  private sendSessionJoin(id: string) {
    console.debug('Sending SessionJoin');
    this.sendCommand(Command.fromSessionJoin({ id }));
  }

  /**
   * Send a SessionLeave command
   * This command leaves the current session
   */
  private sendSessionLeave() {
    console.debug('Sending SessionLeave');
    this.sendCommand(Command.fromSessionLeave({}));
  }

}
