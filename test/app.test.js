const request = require('supertest');
const expect = require('chai').expect;
const knex = require('../db/knex');
const app = require('../app');

describe('CRUD cards test', () => {

  before((done) => {
    knex.migrate.latest()
      .then(() => {
        knex.seed.run();
      }).then(() => done());
  });

  it('Should success if list all cards', (done) => {
    request(app)
      .get('/api/cards/')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.a('array');
        console.log(response.body);
        done();
      });
  });
  it('Should success if get a speficic card', (done) => {
    request(app)
      .get('/api/cards/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.a('object');
        console.log(response.body);
        done();
      });
  });
});
