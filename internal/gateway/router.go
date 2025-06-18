package gateway

import "net/http"

func New() *http.ServeMux {
	mux := http.NewServeMux()
	// TODO: mount handlers
	return mux
}
