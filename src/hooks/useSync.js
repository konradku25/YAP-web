import { useCallback, useEffect, useRef, useState } from 'react';

const SERVER_WS = import.meta.env.VITE_SERVER_WS ?? 'wss://yap-server-bnog.onrender.com';

export function useSync(sessionId, onRemoteState, onRemoteTheme) {
  const [status, setStatus] = useState('disconnected');
  const [peers, setPeers] = useState(0);
  const [devices, setDevices] = useState([]);
  const wsRef = useRef(null);
  const pingRef = useRef(null);
  const onRemoteStateRef = useRef(onRemoteState);
  const onRemoteThemeRef = useRef(onRemoteTheme);
  onRemoteStateRef.current = onRemoteState;
  onRemoteThemeRef.current = onRemoteTheme;

  useEffect(() => {
    if (!sessionId) return;
    setStatus('connecting');
    const ws = new WebSocket(SERVER_WS);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'join', sessionId, device: 'web' }));
      setStatus('connected');
      pingRef.current = setInterval(() => ws.send(JSON.stringify({ type: 'ping' })), 25000);
    };

    ws.onmessage = (e) => {
      let msg;
      try { msg = JSON.parse(e.data); } catch { return; }
      if (msg.type === 'state') onRemoteStateRef.current?.(msg.payload);
      if (msg.type === 'theme') onRemoteThemeRef.current?.(msg.payload);
      if (msg.type === 'peers') { setPeers(msg.count); setDevices(msg.devices ?? []); }
    };

    ws.onclose = () => { setStatus('disconnected'); clearInterval(pingRef.current); };
    ws.onerror = () => { setStatus('disconnected'); };

    return () => { clearInterval(pingRef.current); ws.close(1000, 'cleanup'); };
  }, [sessionId]);

  const sendState = useCallback((payload) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: 'state', sessionId, payload }));
  }, [sessionId]);

  const sendTheme = useCallback((payload) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: 'theme', sessionId, payload }));
  }, [sessionId]);

  return { status, peers, devices, sendState, sendTheme };
}
