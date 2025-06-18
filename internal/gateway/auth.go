package gateway

import (
	"encoding/json"
	"net/http"

	"nyancord/internal/auth"
)

// AuthHandlers wraps authentication endpoints.
type AuthHandlers struct {
	Service *auth.Service
}

func (h *AuthHandlers) Register(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if err := h.Service.Register(req.Username, req.Password); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

func (h *AuthHandlers) Login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	token, err := h.Service.Login(req.Username, req.Password)
	if err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}
