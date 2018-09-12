const request = require('supertest');
const expect = require('chai').expect;
const knex = require('../db/knex');
const app = require('../app');
const seedCards = require('../support/seeds/cards');

const testPut = {
  title: 'João Pessoa - Paraíba',
  description: 'City of the sun',
  latitude: -7.115,
  longitude: -34.86306,
};

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
  it('Should success if insert a speficic card', (done) => {
    request(app)
      .post('/api/cards/')
      .send(seedCards[0])
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.a('object');
        console.log(response.body);
        done();
      });
  });
  it('Should success if update a speficic card', (done) => {
    request(app)
      .put('/api/cards/1')
      .send(testPut)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .then((response) => {
        expect(response.body).to.be.a('object');
        console.log(response.body);
        done();
      });
  });
  it('Should success if delete a speficic card', (done) => {
    request(app)
      .delete('/api/cards/3')
      .send(testPut)
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
