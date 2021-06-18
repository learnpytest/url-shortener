# Url Shorterner

A web application to provide user shortened URL

## Prerequisites
Make sure you have installed the following prerequisites:
- Node.js
- Dependencies - Make sure you've installed Node.js and npm first, then install depencies using npm:

$ npm install

## Initializing project
Make sure you've got all prerequisites, then initializing project by node using npm scripts:

$ npm run start

or initializing project by nodemon using:

$ npm run dev

## Usage
- By entering original URL and clicking "Shorten" button, the app will generate a shorter URL for user to direct to orginal URL
- The shoter URL that the app provids is uniquely matched to one original URL
- With each original URL will only get one unique shorter URL to avoid duplication

## Specification
- Using Fsiher-Yates shuffle to increase randomness when generating shorter URL
