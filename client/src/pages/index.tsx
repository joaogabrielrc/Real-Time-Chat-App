import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useState
} from 'react';
import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:8000');

export type Message = {
  name: string;
  text: string;
};

function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [joined, setJoined] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [typingDisplay, setTypingDisplay] = useState<string>('');

  useEffect(() => {
    socket.emit('findAllMessages', {}, (response: Message[]) => {
      setMessages(response);
    });

    socket.on('message', (message: Message) => {
      setMessages((prevState) => prevState.concat(message));
    });

    socket.on('typing', ({ name, isTyping }) => {
      setTypingDisplay(isTyping ? `${name} is typing...` : '');
    });

    return () => {
      socket.off('message');
      socket.off('typing');
    };
  }, []);

  const join = (event: SyntheticEvent) => {
    event.preventDefault();
    socket.emit('join', { name }, () => {
      setJoined(true);
    });
  };

  const emitTyping = () => {
    socket.emit('typing', { isTyping: true });
    setTimeout(() => {
      socket.emit('typing', { isTyping: false });
    }, 2000);
  };

  const sendMessage = (event: SyntheticEvent) => {
    event.preventDefault();
    socket.emit('createMessage', { text: messageText }, () => {
      setMessageText('');
    });
  };

  const handleMessage = (event: ChangeEvent<HTMLInputElement>) => {
    emitTyping();
    setMessageText(event.target.value);
  };

  const handleName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-between py-12 bg-slate-900 text-white">
      {joined ? (
        <>
          <ul>
            {messages.map((message, index) => (
              <li key={index} className="text-md">
                [{message.name}]: {message.text}
              </li>
            ))}
          </ul>

          <div>
            {typingDisplay && (
              <span className="text-sm text-gray-300">
                {typingDisplay}
              </span>
            )}

            <form
              onSubmit={sendMessage}
              className="flex flex-col items-center gap-2"
            >
              <label htmlFor="message" className="self-start text-sm">
                Message:
              </label>
              <input
                type="text"
                id="message"
                value={messageText}
                onChange={handleMessage}
                autoComplete="off"
                className="bg-transparent border py-1 px-2 rounded-lg"
              />

              <button
                type="submit"
                className="border rounded-lg py-1 px-3"
              >
                Send
              </button>
            </form>
          </div>
        </>
      ) : (
        <form
          onSubmit={join}
          className="flex flex-col items-center gap-2"
        >
          <label htmlFor="name">What&apos;s your name?</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleName}
            autoComplete="off"
            className="bg-transparent border py-1 px-2 rounded-lg"
          />

          <button
            type="submit"
            className="border rounded-lg py-1 px-3"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}

export default HomePage;
