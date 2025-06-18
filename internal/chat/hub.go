package chat

import (
	"sync"

	"github.com/gorilla/websocket"
)

// Hub maintains active connections
// and broadcasts messages to them

type Hub struct {
	mu    sync.Mutex
	conns map[*websocket.Conn]struct{}
}

func NewHub() *Hub {
	return &Hub{conns: make(map[*websocket.Conn]struct{})}
}

func (h *Hub) Add(conn *websocket.Conn) {
	h.mu.Lock()
	h.conns[conn] = struct{}{}
	h.mu.Unlock()
}

func (h *Hub) Remove(conn *websocket.Conn) {
	h.mu.Lock()
	delete(h.conns, conn)
	h.mu.Unlock()
}

func (h *Hub) Broadcast(msg []byte) {
	h.mu.Lock()
	for c := range h.conns {
		c.WriteMessage(websocket.TextMessage, msg)
	}
	h.mu.Unlock()
}
