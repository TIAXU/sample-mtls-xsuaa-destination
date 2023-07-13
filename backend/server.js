const xsenv = require("@sap/xsenv");
const UAA_CREDENTIALS = xsenv.getServices({
  myXsuaa: { tag: "xsuaa" },
}).myXsuaa;

const express = require("express");
const app = express();
const xssec = require("@sap/xssec");
const passport = require("passport");
const JWTStrategy = xssec.JWTStrategy;
passport.use("JWT", new JWTStrategy(UAA_CREDENTIALS));
app.use(passport.initialize());

app.listen(process.env.PORT);

app.get(
  "/endpoint",
  passport.authenticate("JWT", { session: false }),
  (req, res) => {
    res.send(`Backend app successfully called.`);
  }
);
