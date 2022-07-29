const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const jwtSecret = "283928nc4823947b23c498n24n384c";

function auth(req, res, next) {
  const authToken = req.headers["authorization"];
  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];
    jwt.verify(token, jwtSecret, (err, data) => {
      if (err) {
        res.status(401);
        res.json({ err: "Token invalido" });
      } else {
        req.token = token;
        req.loggedUser = { id: data.id, email: data.email };
        next();
      }
    });
  } else {
    res.status(401);
    res.json({ err: "Invalid Token" });
  }
}

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
  users: [
    {
      id: 1,
      name: "Renato Pasklan",
      email: "renato@pasklan.com",
      password: "q1w2e3r4",
    },
    {
      id: 2,
      name: "Amanda Pasklan",
      email: "amanda@pasklan.com",
      password: "q1w2e3r4",
    },
  ],
};
//  GETs
app.get("/games", auth, (req, res) => {
  res.statusCode = 200;
  res.json({ user: req.loggedUser, games: DB.games });
});

app.get("/game/:id", auth, (req, res) => {
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
app.post("/game", auth, (req, res) => {
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

app.post("/auth", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    res.json({ err: "invalid data" });
  } else {
    const user = DB.users.find(u => u.email === email);
    if (user) {
      if (user.password === password) {
        jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          jwtSecret,
          { expiresIn: "48h" },
          (err, token) => {
            if (err) {
              res.status(400);
              res.json({ err: "Internal fail" });
            } else {
              res.status(200);
              res.json({ token: token });
            }
          }
        );
      } else {
        res.status(401);
        res.json({ err: "Not authorizated" });
      }
    } else {
      res.status(404);
      res.json({ err: "email not found" });
    }
  }
});

// PUTs
app.put("/game/:id", auth, (req, res) => {
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
app.delete("/game/:id", auth, (req, res) => {
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
