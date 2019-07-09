package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

const (
	host = "localhost"
	port = 5432
	user = "postgres"
	// password = "your-password"
	dbname = "encourage"
)

func main() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"dbname=%s sslmode=disable",
		host, port, user, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	sqlStatement :=
		`INSERT INTO articles(title, content, author, image, youtube) 
	VALUES($1, $2, $3, $4, $5) 
	RETURNING id`

	id := 0
	err = db.QueryRow(sqlStatement, "Famous rides in Tokyo Disney Sea", "Unique rides are the Tower Of Tower and Indiana Jones", "Japan Times", "https://bit.ly/2LGtxyk", "https://www.youtube.com/watch?v=QFxN2oDKk0E").Scan(&id)
	if err != nil {
		panic(err)
	}
	fmt.Println("New record ID is:", id)
}
