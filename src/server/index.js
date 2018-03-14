//@ts-check
import App from '../client/App';
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import csurf from 'csurf'
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import React from 'react';
import { renderToString } from 'react-dom/server';


const errorMiddleware = require('./middlewares/errors')

const dev = process.env.NODE_ENV !== 'production'
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express()

// Remove annoying Express header addition.
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  // request logging. dev: console
  .use(logger('dev'))
  // Parse the body of POST requests
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // Add file compression for Google search performance
  .use(compression())
  // secure apps by setting various HTTP headers
  .use(helmet())
  // enable CORS - Cross Origin Resource Sharing
  .use(cors())
  // Parse any incoming cookies (required for CSRF protection middleware)
  .use(cookieParser())
  // Add CSRF Protection for our cookies
  .use(csurf({ cookie: true }))
  // Catch any errors and send 500;
  .use(errorMiddleware(dev))
  .get('/*', (req, res) => {
    const markup = renderToString(<App />);
    res.send(
      `<!doctype html>
        <html lang="">
          <head>
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta charSet='utf-8' />
              <title>Welcome to Razzle</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              ${assets.client.css
                ? `<link rel="stylesheet" href="${assets.client.css}">`
                : ''}
              ${process.env.NODE_ENV === 'production'
                ? `<script src="${assets.client.js}" defer></script>`
                : `<script src="${assets.client.js}" defer crossorigin></script>`}
          </head>
          <body>
              <div id="root">${markup}</div>
          </body>
      </html>`
    );
  });


export default server
