const express = require("express")
const session = require("express-session")

const app = express()
// Enter session secret key as an argument
const secret = process.argv[2];
app.use(express.urlencoded({ extended: false }))

const cookieParser = require('cookie-parser');

// Middleware setup
const secret = process.argv[2];
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: `${secret}`,
  cookie: {
    httpOnly: true,
    sameSite: true,
  },
  resave: false,
  saveUninitialized: false
}));
app.use(cookieParser());

app.get("/", (req, res) => {
  let name = "Guest"

  if (req.session.user) name = req.session.user

  res.send(`
  <h1>Welcome, ${name}</h1>
  <form action="/register" method="POST">
    <input type="text" name="name" placeholder="Your name">
    <button>Submit</button>
  </form>
  <form action="/forget" method="POST">
    <button>Logout</button>
  </form>
  `)
})

app.post("/register", (req, res) => {
  // name = req.body.name.trim()
  // res.redirect("/")
  req.session.user = req.body.name.trim()
  res.send(`<p>Thank you</p> <a href="/">Back home</a>`)
})

app.post("/forget", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/")
  })
})

app.listen(8000)
