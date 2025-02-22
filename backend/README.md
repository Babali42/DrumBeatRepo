# Back-end

## 🛠️ Technologies

This project is built with:

- **Scala**: Modern language both functional and OOP, best of the two world !
- **Play**: A minimalistic back-end framework for the jvm languages, easy to test
- **MongoDB**: A noSQL database to store beats and groovy rhythms :)

## 📚 References

<details>
  <summary>Misc. references used in this project</summary>

- Back-end hosting : https://render.com/
- Database hosting : https://www.mongodb.com/products/platform/cloud
- https://www.docker.com/
- Database client : https://www.mongodb.com/docs/mongodb-shell/install/
- REST API client : https://github.com/usebruno/bruno
</details>

## ▶️ Run the backend
### 1. Create the env file :

copy the .env.sample file in the current folder, and rename the copy in .env

### 2. Execute the back-end in docker

Go to the backend folder
```cd ./backend/```

Build app image
```docker build -t drum-beat-repo-app-image .```

Run mongo db and the previous image
```docker compose up -d```

## 🛠️ Debug the backend
### Run DrumBeatRepo alone (don't forget to stop the corresponding docker container)
```sbt run```

## 🔫 Execute the tests
```sbt test```

## Access the database


Use the connection string ```mongodb://admin:pass@127.0.0.1:27017/admin```

⚠️ Dont't forget to authenticate️
```
mongosh --username admin --password pass
```

## Useful links

- Drum Beat Database in express : 
http://localhost:8081/db/drum-beat-database/
- Get genres api : http://localhost:9000/genres/

## Coverage

- Run coverage
  - ``sbt coverage test``
- Generate report
  - ``sbt coverageReport``


## How to build docker image

Build image

``` docker build -t drum-beat-repo-app-image . ```

``` docker build --build-arg API_KEY='<YOURAPIKEY>' -t drum-beat-repo-app-image . ```

Run a container with this image

``` docker run -p 9000:9000 -it drum-beat-repo-app-image ```

