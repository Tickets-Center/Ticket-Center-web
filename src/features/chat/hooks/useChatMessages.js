import { useCallback, useEffect, useRef, useState } from "react";
import { chatApi } from "../../../services/api/chat";
import echo from "../../../services/socket/echo";

const toArray = (payload) =>
  Array.isArray(payload) ? payload : (payload?.data ?? []);

/**
 * Loads a ticket's chat history, subscribes to its Reverb channel and exposes
 * an optimistic send function. State is keyed by ticket so switching tickets
 * never flashes another conversation's messages.
 */
export function useChatMessages(ticketId, currentUserId) {
  const [history, setHistory] = useState({ ticketId: null, messages: [] });
  const [loadedFor, setLoadedFor] = useState(null);
  const [errorState, setErrorState] = useState({
    ticketId: null,
    message: "",
  });
  const [sending, setSending] = useState(false);
  const seenIds = useRef(new Set());

  const loading = loadedFor !== ticketId;
  const messages = history.ticketId === ticketId ? history.messages : [];
  const error = errorState.ticketId === ticketId ? errorState.message : "";

  // 1. Load history.
  useEffect(() => {
    if (!ticketId) return undefined;

    let cancelled = false;
    seenIds.current = new Set();

    chatApi
      .getMessages(ticketId)
      .then((payload) => {
        if (cancelled) return;
        const loaded = toArray(payload);
        loaded.forEach((message) => seenIds.current.add(message.id));

        setHistory((previous) => {
          const live =
            previous.ticketId === ticketId ? previous.messages : [];
          const loadedIds = new Set(loaded.map((message) => message.id));
          const unsaved = live.filter(
            (message) => message._opt || !loadedIds.has(message.id),
          );
          return { ticketId, messages: [...loaded, ...unsaved] };
        });
        setLoadedFor(ticketId);
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorState({
          ticketId,
          message:
            err?.status === 403
              ? "You don't have access to this ticket's chat."
              : "Failed to load messages.",
        });
        setLoadedFor(ticketId);
      });

    return () => {
      cancelled = true;
    };
  }, [ticketId]);

  // 2. Subscribe to realtime events.
  useEffect(() => {
    if (!ticketId) return undefined;

    const channel = echo.private(`ticket.${ticketId}`);

    channel.listen(".message.sent", ({ message: incoming }) => {
      if (seenIds.current.has(incoming.id)) return;
      seenIds.current.add(incoming.id);

      setHistory((previous) => {
        const base =
          previous.ticketId === ticketId ? previous.messages : [];
        const optimisticIndex = base.findIndex(
          (message) =>
            message._opt &&
            message.sender_id === incoming.sender_id &&
            message.message === incoming.message,
        );

        if (optimisticIndex !== -1) {
          const next = [...base];
          next[optimisticIndex] = incoming;
          return { ticketId, messages: next };
        }

        return { ticketId, messages: [...base, incoming] };
      });
    });

    channel.listen(".system.message", ({ message: incoming }) => {
      if (seenIds.current.has(incoming.id)) return;
      seenIds.current.add(incoming.id);

      setHistory((previous) => {
        const base =
          previous.ticketId === ticketId ? previous.messages : [];
        return {
          ticketId,
          messages: [...base, { ...incoming, type: "system" }],
        };
      });
    });

    return () => echo.leave(`ticket.${ticketId}`);
  }, [ticketId]);

  // 3. Send with optimistic UI.
  const sendMessage = useCallback(
    async (text) => {
      const value = text.trim();
      if (!value || sending || !ticketId) return false;

      setSending(true);

      const tempId = `opt-${Date.now()}`;
      const optimistic = {
        id: tempId,
        ticket_id: ticketId,
        sender_id: currentUserId,
        sender_name: "You",
        message: value,
        created_at: new Date().toISOString(),
        _opt: true,
      };

      setHistory((previous) => {
        const base =
          previous.ticketId === ticketId ? previous.messages : [];
        return { ticketId, messages: [...base, optimistic] };
      });

      try {
        const real = await chatApi.sendMessage(ticketId, value);
        seenIds.current.add(real.id);

        setHistory((previous) => {
          const base =
            previous.ticketId === ticketId ? previous.messages : [];
          const replaced = base.map((message) =>
            message.id === tempId ? real : message,
          );
          const seen = new Set();
          const deduped = replaced.filter((message) => {
            if (seen.has(message.id)) return false;
            seen.add(message.id);
            return true;
          });
          return { ticketId, messages: deduped };
        });

        return true;
      } catch {
        setHistory((previous) => {
          const base =
            previous.ticketId === ticketId ? previous.messages : [];
          return {
            ticketId,
            messages: base.filter((message) => message.id !== tempId),
          };
        });
        return false;
      } finally {
        setSending(false);
      }
    },
    [ticketId, sending, currentUserId],
  );

  return { messages, loading, error, sending, sendMessage };
}
