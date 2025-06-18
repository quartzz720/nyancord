package gateway

import (
	"net/http"

	"nyancord/internal/auth"
)

func New(authSvc *auth.Service) *http.ServeMux {
	mux := http.NewServeMux()
	h := &AuthHandlers{Service: authSvc}
	mux.HandleFunc("/api/register", h.Register)
	mux.HandleFunc("/api/login", h.Login)
	return mux
}
