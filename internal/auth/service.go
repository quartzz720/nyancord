package auth

import (
	"errors"
	"sync"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Service provides simple in-memory user authentication.
type Service struct {
	mu       sync.Mutex
	users    map[string][]byte // username -> hashed password
	sessions map[string]string // token -> username
}

func NewService() *Service {
	return &Service{
		users:    make(map[string][]byte),
		sessions: make(map[string]string),
	}
}

// Register creates a new user with the given password.
func (s *Service) Register(username, password string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, exists := s.users[username]; exists {
		return errors.New("user exists")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	s.users[username] = hash
	return nil
}

// Login verifies credentials and returns an auth token.
func (s *Service) Login(username, password string) (string, error) {
	s.mu.Lock()
	hash, ok := s.users[username]
	s.mu.Unlock()
	if !ok {
		return "", errors.New("invalid credentials")
	}
	if err := bcrypt.CompareHashAndPassword(hash, []byte(password)); err != nil {
		return "", errors.New("invalid credentials")
	}
	token := uuid.NewString()
	s.mu.Lock()
	s.sessions[token] = username
	s.mu.Unlock()
	return token, nil
}

// Username returns the username associated with the token, if any.
func (s *Service) Username(token string) (string, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	u, ok := s.sessions[token]
	return u, ok
}
