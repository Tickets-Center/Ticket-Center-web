import { useEffect, useRef, useState } from "react";
import "../../../styles/chatbox.css";
import Avatar from "../../../components/ui/Avatar";
import { formatTime } from "../../../lib/format";
import { useAuth } from "../../auth/useAuth";
import { useChatMessages } from "../hooks/useChatMessages";

const isSystemMessage = (message) =>
  message.type === "system" ||
  message.sender_id === null ||
  message.sender_id === undefined;

function SystemMessage({ message, createdAt }) {
  return (
    <div className="system-message">
      <div className="system-message-card">
        <span className="system-message-app">Ticket Center</span>
        <span className="system-message-text" title={formatTime(createdAt)}>
          {message}
        </span>
        <span className="system-message-time">{formatTime(createdAt)}</span>
      </div>
    </div>
  );
}

export default function ChatBox({
  ticketId,
  ticketTitle = "Ticket Chat",
  onClose,
}) {
  const { user } = useAuth();
  const { messages, loading, error, sending, sendMessage } = useChatMessages(
    ticketId,
    user?.id,
  );

  const [text, setText] = useState("");
  const [minimized, setMinimized] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const value = text;
    if (!value.trim()) return;

    setText("");
    const sent = await sendMessage(value);
    if (!sent) setText(value);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  if (minimized) {
    return (
      <button
        type="button"
        className="messenger-bubble"
        onClick={() => setMinimized(false)}
        title="Open chat"
      >
        <span className="messenger-bubble-icon">💬</span>
      </button>
    );
  }

  return (
    <div className="messenger-window">
      <header className="messenger-header">
        <div className="header-left">
          <span className="chat-brand">TC</span>
          <div>
            <div className="name">{ticketTitle}</div>
            <div className="status">Ticket #{ticketId}</div>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            onClick={() => setMinimized(true)}
            title="Minimise"
          >
            —
          </button>
          {onClose && (
            <button type="button" onClick={onClose} title="Close">
              ✕
            </button>
          )}
        </div>
      </header>

      <div className="messenger-body">
        {loading && <p className="chat-notice">Loading messages…</p>}
        {error && <p className="chat-notice chat-notice-error">{error}</p>}
        {!loading && !error && messages.length === 0 && (
          <p className="chat-notice">No messages yet — start the conversation.</p>
        )}

        {messages.map((message, index) => {
          if (isSystemMessage(message)) {
            return (
              <SystemMessage
                key={message.id}
                message={message.message}
                createdAt={message.created_at}
              />
            );
          }

          const isMe = message.sender_id === user?.id;
          const previous = messages[index - 1];
          const grouped =
            previous &&
            !isSystemMessage(previous) &&
            previous.sender_id === message.sender_id;

          return (
            <div
              key={message.id}
              className={`msg-row ${isMe ? "user" : "bot"}`}
            >
              {isMe ? (
                grouped ? (
                  <div className="chat-avatar-spacer" />
                ) : (
                  <Avatar
                    name={user?.name}
                    size={28}
                    className="chat-avatar"
                  />
                )
              ) : grouped ? (
                <div className="chat-avatar-spacer" />
              ) : (
                <Avatar
                  name={message.sender_name}
                  size={28}
                  background="var(--glass)"
                  color="var(--fg)"
                  className="chat-avatar"
                />
              )}

              <div
                className={`msg-bubble ${isMe ? "user" : "bot"} ${grouped ? "grouped" : ""}`}
                title={formatTime(message.created_at)}
                style={{ opacity: message._opt ? 0.6 : 1 }}
              >
                {!isMe && !grouped && (
                  <div className="msg-sender">
                    {message.sender_name || "User"}
                  </div>
                )}
                {message.message}
                <div
                  className={`msg-time ${isMe ? "user" : "bot"}`}
                >
                  {formatTime(message.created_at)}
                  {message._opt && " · sending…"}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <footer className="messenger-footer">
        <input
          ref={inputRef}
          placeholder={error ? "Chat unavailable" : "Message… (Enter to send)"}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending || Boolean(error)}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || sending || Boolean(error)}
        >
          {sending ? "…" : "Send"}
        </button>
      </footer>
    </div>
  );
}
