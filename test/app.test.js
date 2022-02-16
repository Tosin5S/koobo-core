require("dotenv").config()
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const User = require('../model/user')
const { assert, expect, should } = chai
const jwt = require('jsonwebtoken')
const { json } = require("express/lib/response")
// const supertest = require('supertest')

// const apptest = supertest(http.createServer(app.callback()))
chai.use(chaiHttp)

const USER = {
     firstName : "TEST",
     lastName : "TEST",
     email : "test@test.com",
     password : "test123"
}
const USER1 = {
  firstName : "TEST1",
  lastName : "TEST1",
  email : "test1@test.com",
  password : "test123123"
}
// TODO
// 1. Test signup route
// 2. Test login route
// 3. Test welcome route
// 4. Test random route
before(done => {
  done()
})
describe('Authentication', () => {
    /**
     * Test Signup Route 
     * Method: POST
     */
    describe('POST /api/v1/signup', () => {

        it('User Can Sign Up', done => {
            chai
            .request(app)
            .post('/api/v1/signup')
            .send(USER)
            .then(res => {
                expect(res).to.have.status(201)
                done()
            })
            .catch(err => console.log('POST /api/v1/signup', err.message));
        });
        it('User can not signup again with the same email', done => {
            chai
            .request(app)
            .post('/api/v1/signup')
            .send(USER)
            .then(res => {
                expect(res).to.have.status(409);
                assert.equal(res.text, "User Already Exist. Please Login")
                done()
            })
            .catch(err => console.log('POST /api/v1/signup', err.message))
      })
    })
    /**
     * Test Login Route
     * Method: POST
     */
    describe('POST /api/v1/login', () => {
        it('User cannot Login without signup', done => {
            chai
              .request(app)
              .post('/api/v1/login')
              .send(USER1.email, USER1.password)
              .then(res => {
                expect(res).to.have.status(400)
                assert.equal(res.text, 'Invalid Credentials')
                done()
              })
              .catch(err => console.log('POST /api/v1/login', err.message));
          });
          it('User Can Login', done => {
            chai
              .request(app)
              .post('/api/v1/login')
              .send(USER.email, USER.password)
              .then(res => {
                expect(res).to.have.status(200)
                assert.equal(res.json, USER)
                done()
              })
              .catch(err => console.log('POST /api/v1/login', err.message));
          });
          it('User can not login with incorrect password', done => {
            chai
              .request(app)
              .post('/api/v1/login')
              .send({
                email: USER.email,
                password: USER1.password
              })
              .then(res => {
                expect(res).to.have.status(400)
                assert.equal(res.text, 'Invalid Credentials')
                done()
              })
              .catch(err => console.log('POST /api/v1/login', err.message));
          });
    })

    /**
     * Test Welcome Route
     * Method: GET
     */
    describe('GET /api/v1/welcome', () => {

        it(`GET welcome page (No Token)`, done => {
            chai
              .request(app)
              .get('/api/v1/welcome')
              .then(res => {
                expect(res).to.have.status(403)
                assert.equal(res.body.text, 'A token is required for authentication')
                done()
              })
              .catch(err => console.log('GET /api/v1/welcome', err.message));
          })

          it(`GET welcome page (Unauthorized Token)`, done => {
            User.findOne({ where: { email: USER.email } }).then(user => {
                const { _id, email } = user
                const token = jwt.sign(
                  {
                    user: { user_id: user._id, email }
                  },
                  secret,
                  {
                    expiresIn: "5h"
                  }
                )
            chai
              .request(app)
              .get('/api/v1/welcome')
              .then(res => {
                expect(res).to.have.status(401)
                assert.equal(res.header.token, token)
                assert.equal(res.body.text, 'Invalid Token')
                done()
              })
              .catch(err => console.log('GET /api/v1/welcome', err.message));
          })

          it(`GET /api/v1/welcome (User Authorized)`, done => {
            User.findOne({ where: { email: USER.email } }).then(user => {
              const { _id, email } = user
              const token = jwt.sign(
                {
                  user: { user_id: user._id, email }
                },
                secret,
                {
                  expiresIn: "5h"
                }
              );
              chai
                .request(app)
                .get('/api/v1/welcome')
                .set('Authorization', `Bearer ${token}`)
                .then(res => {
                  expect(res).to.have.status(200)
                  assert.equal(res.body.json, USER)
                  done()
                })
                .catch(err => console.log('GET /api/v1/welcome', err.message));
            })
          })
        })
    
    })
    /**
     * Test Random Route
     * Method: GET
     */
     after(done => {
      User.findOneAndDelete({ where: { email: USER.email } }).then(() => {
        done()
      })
    })
})