const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const DB = {
  games: [
    {
      id: 23,
      title: "Mass Effect",
      year: 2012,
      price: 50,
    },
    {
      id: 33,
      title: "Dragon Age Inquisition",
      year: 2013,
      price: 62,
    },
    {
      id: 73,
      title: "Sea of Stars",
      year: 2023,
      price: 38,
    },
  ],
};
//  GETs
app.get("/games", (req, res) => {
  res.statusCode = 200;
  res.json(DB.games);
});

app.get("/game/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    const id = parseInt(req.params.id);
    const game = DB.games.find(game => game.id === id);
    if (game != undefined) {
      res.statusCode = 200;
      res.json(game);
    } else {
      res.sendStatus(404);
    }
  }
});

//  POSTs
app.post("/game", (req, res) => {
  const { title, year, price } = req.body;

  if (!title || !year || !price) {
    res.sendStatus(400);
  } else {
    DB.games.push({
      id: Math.floor(Math.random() * 100),
      title,
      year,
      price,
    });
    res.sendStatus(200);
  }
});

// PUTs
app.put("/game/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    const id = parseInt(req.params.id);
    const game = DB.games.find(g => g.id === id);
    if (game != undefined) {
      const { title, year, price } = req.body;
      if (title) {
        game.title = title;
      }
      if (year) {
        game.year = year;
      }
      if (price) {
        game.price = price;
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

// Delete
app.delete("/game/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    const id = parseInt(req.params.id);
    // verifica se existe id no array
    const index = DB.games.findIndex(game => game.id === id);
    if (index == -1) {
      res.statusCode(404);
    } else {
      DB.games.splice(index, 1);
      res.sendStatus(200);
    }
  }
});

// Server
app.listen(2222, () => {
  console.log("API executando na porta 2222!");
});
