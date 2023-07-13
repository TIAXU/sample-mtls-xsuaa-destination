const xsenv = require("@sap/xsenv");
const DESTINATION_CREDENTIALS = xsenv.getServices({
  myDestination: { tag: "destination" },
}).myDestination;

const fetch = require("node-fetch");
const xssec = require("@sap/xssec");
const express = require("express");
const app = express();

// start server
app.listen(process.env.PORT);

// app entry endpoint
app.get("/app", async (req, res) => {
  // call destination service
  const destJwtToken = await _fetchTokenForDestinationService(
    DESTINATION_CREDENTIALS
  );
  const destination = await _callDestinationService(
    "destination_to_mtlsapp",
    destJwtToken
  );

  // call backend app
  const backendUrl = destination.destinationConfiguration.URL + "/endpoint";
  const backendJwtToken = destination.authTokens[0].value;
  const response = await _callBackend(backendUrl, backendJwtToken);

  // decode the JWT token
  const backendJwtDecoded = new xssec.TokenInfo(backendJwtToken).getPayload();

  res.send(
    `Frontend app called. Response from Backend: <p>${response}</p> The JWT token used for backend: <p>${JSON.stringify(
      backendJwtDecoded
    )}</p>`
  );
});

/* HELPER */

async function _fetchTokenForDestinationService(uaa) {
  return new Promise((resolve, reject) => {
    xssec.requests.requestClientCredentialsToken(
      null,
      uaa,
      null,
      null,
      (error, token) => {
        resolve(token);
      }
    );
  });
}

async function _callDestinationService(destinationName, jwtToken) {
  const destServiceUrl = `${DESTINATION_CREDENTIALS.uri}/destination-configuration/v1/destinations/${destinationName}`;
  const options = {
    headers: { Authorization: "Bearer " + jwtToken },
  };
  const response = await fetch(destServiceUrl, options);
  const responseJson = await response.json();
  return responseJson;
}

async function _callBackend(url, jwtToken) {
  const options = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  const response = await fetch(url, options);
  const responseText = await response.text();
  return responseText;
}

