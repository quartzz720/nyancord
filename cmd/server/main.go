package main

import (
	"log"
	"net/http"

	"nyancord/internal/auth"
	"nyancord/internal/chat"
	"nyancord/internal/gateway"
)

func main() {
	hub := chat.NewHub()
	authSvc := auth.NewService()
	mux := gateway.New(authSvc)
	mux.Handle("/ws", chat.NewHandler(hub))
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	log.Println("server started on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}
