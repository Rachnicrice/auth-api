'use strict';

// require('@code-fellows/supergoose');
const middleware = require('../middleware/basic.js');
const { db, users } = require('../models');

let testUsers = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
};

beforeAll(async (done) => {
  await db.sync();
  await users.create(testUsers.admin);
  done();
});
afterAll(async (done) => {
  await db.drop();
  done();
});

describe('Auth Middleware', () => {

  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res)
  }
  const next = jest.fn();

  describe('user authentication', () => {

    it('fails a login for a user (admin) with the incorrect basic credentials', () => {
      req.headers = {
        authorization: 'Basic badpassword',
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(403);
        });

    });

    it('logs in an admin user with the right credentials', () => {
      req.headers = {
        authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith();
        });

    });

  });

});
