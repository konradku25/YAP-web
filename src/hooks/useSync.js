import { useCallback, useEffect, useRef, useState } from 'react';

// Update this after deploying to Render
const SERVER_WS = import.meta.env.VITE_SERVER_WS ?? 'wss://yap-server-bnog.onrender.com';

export function useSync(sessionId, onRemoteState) {
  const [status, setStatus] = useState('disconnected'); // connecting | connected | disconnected
  const [peers, setPeers] = useState(0);
  const wsRef = useRef(null);
  const pingRef = useRef(null);
  const onRemoteRef = useRef(onRemoteState);
  onRemoteRef.current = onRemoteState;

  useEffect(() => {
    if (!sessionId) return;

    setStatus('connecting');
    const ws = new WebSocket(SERVER_WS);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'join', sessionId }));
      setStatus('connected');
      // Keepalive ping every 25s
      pingRef.current = setInterval(() => ws.send(JSON.stringify({ type: 'ping' })), 25000);
    };

    ws.onmessage = (e) => {
      let msg;
      try { msg = JSON.parse(e.data); } catch { return; }
      if (msg.type === 'state') onRemoteRef.current?.(msg.payload);
      if (msg.type === 'peers') setPeers(msg.count);
    };

    ws.onclose = () => {
      setStatus('disconnected');
      clearInterval(pingRef.current);
    };

    ws.onerror = () => {
      setStatus('disconnected');
    };

    return () => {
      clearInterval(pingRef.current);
      ws.close(1000, 'cleanup');
    };
  }, [sessionId]);

  const sendState = useCallback((timerState) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({
      type: 'state',
      sessionId,
      payload: timerState,
    }));
  }, [sessionId]);

  return { status, peers, sendState };
}
