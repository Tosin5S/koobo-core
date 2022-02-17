require("dotenv").config()
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const User = require('../model/user')
const {
  assert,
  expect,
  should
} = chai
const jwt = require('jsonwebtoken')
const {
  json
} = require("express/lib/response")
// const supertest = require('supertest')

// const apptest = supertest(http.createServer(app.callback()))
chai.use(chaiHttp)

const USER = {
  firstName: "TEST",
  lastName: "TEST",
  email: "test@test.com",
  password: "test123"
}
const USER1 = {
  firstName: "TEST1",
  lastName: "TEST1",
  email: "test1@test.com",
  password: "test123123"
}



describe('Authentication', () => {
  before(done => {
    User.findOneAndDelete({
        where: {
          email: USER.email
        }
      })
      .then(() => {
        done()
      })
  })
  /**
   * Test Signup Route 
   * Method: POST
   */
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
  })

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

  /**
   * Test Login Route
   * Method: POST
   */


  it('User cannot Login without signup', done => {
    chai
      .request(app)
      .post('/api/v1/login')
      .send(USER1.email, USER1.password)
      .then(res => {
        expect(res).to.have.status(400)
        assert.equal(res.text, 'All input is required')
        done()
      })
      .catch(err => console.log('POST /api/v1/login', err.message));
  })

  it('User Can Login', done => {
    chai
      .request(app)
      .post('/api/v1/login')
      .send(USER.email, USER.password)
      .then(res => {
        expect(res).to.have.status(200)
        done()
      })
      .catch(err => console.log('POST /api/v1/login', err.message));
  })

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
  })

  /**
   * Test Welcome Route
   * Method: GET
   */
  it(`GET welcome page (No Token)`, done => {
    chai
      .request(app)
      .get('/api/v1/welcome')
      .then(res => {
        expect(res).to.have.status(403)
        assert.equal(res.text, 'A token is required for authentication')
        done()
      })
      .catch(err => console.log('GET /api/v1/welcome', err.message));
  })

    it(`GET /api/v1/welcome (User Authorized)`, done => {
        const token = jwt.sign({
            user: {
              user_id: USER._id,
              email: USER.email
            }
          },
         process.env.TOKEN_KEY, {
            expiresIn: "5h"
          })

        chai
          .request(app)
          .get('/api/v1/welcome')
          .set('x-access-token', token)
          .then(res => {
            expect(res).to.have.status(200)
            assert.equal(res.json, USER)
            done()
          })
          .catch(err => console.log('GET /api/v1/welcome', err.message));
      })
    })


  /**
   * Test Random Route
   * Method: GET
   */

