# Free Walking

This repository implements the backend side of the project Free Walking, that aims to provide a new platform to people that desire sharing personal routes during a travel. This repository will contain a pool of functionalities and endpoints, each of them, when implemented, will be specified here.

[![Code style: airbnb](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat-square)](https://github.com/airbnb/javascript)

## Stack

* [node](https://nodejs.org/en/) (6.11.1)
* [PostgreSQL](https://www.postgresql.org) (10.5)
* [knex.js](https://knexjs.org) (0.15.2)
* [mocha.js](https://mochajs.org) (5.2.0)
* [lint](https://eslint.org)(5.5.0)
* [npm](https://www.npmjs.com) (3.10.10)

## Cards

Each card contais information about the place visited by the user and stores them.

### End points

| Method |          URL          |         Description         |
|:------:|:---------------------:|:---------------------------:|
|   GET  |     /api/cards/    | Get all cards in database |
|   GET  | /api/cards/\<id\> |  Get a cards with \<id\> |
|   POST  | /api/cards/   | Insert one card in database |
| PUT   | /api/cards/\<id\> | Updates a specific card with \<id\> |
| DELETE | /api/cards/\<id\> | Delete a specific card with \<id\> |

The POST requisition require the following JSON formmat:

```javascript
{
	"title": "João Pessoa",
	"description": "City of Paraíba state",
	"latitude": -7.115,
	"longitude": -34.86306
}
```

The PUT requisition require the following JSON formmat:

```javascript
{
	"id": 1,
	"title": "João Pessoa",
	"description": "City of Paraíba state",
	"latitude": -7.115,
	"longitude": -34.86306
}
```

## Installation

Install all necessary modules to run the current project.

```bash
$ git clone https://github.com/alvesfelipe/free-walking
$ cd free-walking
$ npm install
```

## Development

```bash
$ cd free-walking
$ npm run dev
```
Tested on MacBook Pro device, using the OS X El Capitan Version 10.11.6.

## Contributors

* Felipe Alves ([alvesfelipe](https://github.com/alvesfelipe))

