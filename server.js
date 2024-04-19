// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const authRoutes = require("./routes/authRoutes");
const walletAuthRoutes = require('./routes/walletAuthRoutes'); // Added for Ethereum wallet authentication
const apiRoutes = require('./routes/apiRoutes'); // Added for AJAX API routes
const adminRoutes = require('./routes/adminRoutes'); // Added for Admin panel
const http = require('http');
const { Server } = require("socket.io");
const { isAuthenticated } = require('./routes/middleware/authMiddleware'); // Import isAuthenticated middleware
const isAdmin = require('./routes/middleware/adminMiddleware'); // Import isAdmin middleware
const Dragon = require('./models/Dragon'); // Import Dragon model

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  }),
);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Authentication Routes
app.use(authRoutes);

// Wallet Authentication Routes - Added for Ethereum wallet authentication
app.use(walletAuthRoutes);

// API Routes for AJAX requests - Added for dashboard updates
app.use('/api', apiRoutes);

// Admin Routes - Added for Admin panel
app.use('/admin', adminRoutes);

// Socket.io event handling
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  // Example event handlers
  socket.on('feedDragon', (data) => {
    // Handle dragon feeding here and emit updates
    io.emit('dragonUpdate', { hunger: data.newHungerLevel, happiness: data.newHappinessLevel });
  });

  socket.on('harvestFruit', (data) => {
    // Handle fruit harvesting here and emit updates
    io.emit('gardenUpdate', { fruitCount: data.newFruitCount });
  });
});

// Root path response
app.get("/", (req, res) => {
  if (req.session.userId) {
    Dragon.findOne({ userId: req.session.userId }).then(dragon => {
      res.render("index", { dragon: dragon || null });
    }).catch(err => {
      console.error(`Error fetching dragon for user ${req.session.userId}:`, err);
      res.status(500).send("There was an error serving your request.");
    });
  } else {
    res.render("index", { dragon: null });
  }
});

// Dashboard route
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard");
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

// Replace app.listen with server.listen
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});