// app.go
package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

type App struct {
	Router *mux.Router
	DB     *sql.DB
}

type article struct {
	ID      int    `json: "id"`
	Title   string `json: "title"`
	Content string `json: "content"`
	Author  string `json: "author"`
	Image   string `json: "image"`
	Youtube string `json: "youtube"`
}

func main() {
	a := App{}
	a.Initialize(
		os.Getenv("eliaahadi"),
		os.Getenv("encourage"),
		os.Getenv("disable"),
	)

	a.Run(":3001")
}

func (a *App) Initialize(user, dbname, sslmode string) {
	var err error

	a.DB, err = sql.Open("postgres", "user=eliaahadi dbname=encourage sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	a.Router = mux.NewRouter()
	a.initializeRoutes()
}
func (a *App) Run(addr string) {
	fmt.Println("listening on port 3001/articles")

	log.Fatal(http.ListenAndServe(":3001", a.Router))
}
func (a *App) initializeRoutes() {
	a.Router.HandleFunc("/articles", a.getArticles).Methods("GET")
	a.Router.HandleFunc("/articles", a.createArticle).Methods("POST")
	a.Router.HandleFunc("/articles/{id:[0-9]+}", a.getArticle).Methods("GET")
	a.Router.HandleFunc("/articles/{id:[0-9]+}", a.updateArticle).Methods("PUT")
	a.Router.HandleFunc("/articles/{id:[0-9]+}", a.deleteArticle).Methods("DELETE")
}

//SQL methods
func getArticles(db *sql.DB, start, count int) ([]article, error) {
	rows, err := db.Query(
		"SELECT id, title, content, author, image, youtube FROM articles LIMIT $1 OFFSET $2",
		count, start)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	articles := []article{}

	for rows.Next() {
		var p article
		if err := rows.Scan(&p.ID, &p.Title, &p.Content, &p.Author, &p.Image, &p.Youtube); err != nil {
			return nil, err
		}
		articles = append(articles, p)
	}
	return articles, nil
}

func (p *article) getArticle(db *sql.DB) error {
	return db.QueryRow("SELECT title, content, author, image, youtube FROM articles WHERE id=$1",
		p.ID).Scan(&p.Title, &p.Content, &p.Author, &p.Image, &p.Youtube)
}

func (p *article) updateArticle(db *sql.DB) error {
	_, err :=
		db.Exec("UPDATE articles SET title=$1, content=$2, author=$3, image=$4, youtube=$5 WHERE id=$6",
			p.Title, p.Content, p.Author, p.Image, p.Youtube, p.ID)
	return err
}

func (p *article) deleteArticle(db *sql.DB) error {
	_, err := db.Exec("DELETE FROM articles WHERE id=$1", p.ID)
	return err
}

func (p *article) createArticle(db *sql.DB) error {
	err := db.QueryRow(
		"INSERT INTO articles(title, content, author, image, youtube) VALUES($1, $2, $3, $4, $5) RETURNING id",
		p.Title, p.Content, p.Author, p.Image, p.Youtube).Scan(&p.ID)
	if err != nil {
		return err
	}
	return nil
}

//SQL responses
func (a *App) getArticles(w http.ResponseWriter, r *http.Request) {
	count, _ := strconv.Atoi(r.FormValue("count"))
	start, _ := strconv.Atoi(r.FormValue("start"))
	if count > 10 || count < 1 {
		count = 10
	}
	if start < 0 {
		start = 0
	}
	articles, err := getArticles(a.DB, start, count)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondWithJSON(w, http.StatusOK, articles)
}
func (a *App) createArticle(w http.ResponseWriter, r *http.Request) {
	var p article
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&p); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	defer r.Body.Close()
	if err := p.createArticle(a.DB); err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondWithJSON(w, http.StatusCreated, p)
}
func (a *App) getArticle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid article ID")
		return
	}
	p := article{ID: id}
	if err := p.getArticle(a.DB); err != nil {
		switch err {
		case sql.ErrNoRows:
			respondWithError(w, http.StatusNotFound, "Article not found")
		default:
			respondWithError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}
	respondWithJSON(w, http.StatusOK, p)
}
func (a *App) updateArticle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid article ID")
		return
	}
	var p article
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&p); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid resquest payload")
		return
	}
	defer r.Body.Close()
	p.ID = id
	if err := p.updateArticle(a.DB); err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondWithJSON(w, http.StatusOK, p)
}
func (a *App) deleteArticle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid Article ID")
		return
	}
	p := article{ID: id}
	if err := p.deleteArticle(a.DB); err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondWithJSON(w, http.StatusOK, map[string]string{"result": "success"})
}

//JSON response format
func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}
func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}
