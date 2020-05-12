const request = require('supertest');

const app = require('../app');
const controller = require('../controllers/admins');

const BASE_URL = '/api/v1/admins';

let testMainAdmin = {
  firstName: 'john',
  middleName: 'mako',
  lastName: 'dinero',
  email: 'johndinero@gmail.com',
  idNumber: '34565635',
  addressNumber: '34',
  addressCode: '3400',
  addressTown: 'nyali',
  phoneNumber: '0788543122'
};

beforeAll(async () => {
  testMainAdmin = await controller.create(testMainAdmin);
});

describe('Admin operations /admins', () => {
  test('POST /login should respond with error', async (done) => {
    try {
      const resp = await request(app)
        .post(`${BASE_URL}/login`)
        .send({
          email: testMainAdmin.email,
          password: 'password'
        });

      expect(resp.statusCode).toBe(200);
      expect(resp.body.error.accState).toEqual('NEEDS_RESET');
      done();
    } catch (error) {
      done(error);
    }
  });

  test('POST /:adminId/change-password should respond with success', async (done) => {
    try {
      const resp = await request(app)
        .put(`${BASE_URL}/${testMainAdmin.id}/change-password`)
        .send({
          oldPassword: 'password',
          newPassword: 'johndi48',
          newPasswordConfirm: 'johndi48'
        });

      expect(resp.statusCode).toBe(200);
      expect(resp.body.status).toBe('success');
      done();
    } catch (error) {
      done(error);
    }
  });

  test('POST /login should respond with authenticated admin', async (done) => {
    try {
      const resp = await request(app)
        .post(`${BASE_URL}/login`)
        .send({
          email: testMainAdmin.email,
          password: 'johndi48'
        });

      expect(resp.statusCode).toBe(200);
      expect(resp.body.data.token).toBeDefined();
      testMainAdmin = resp.body.data;
      done();
    } catch (error) {
      done(error);
    }
  });

  let testAdmin = {
    firstName: 'paul',
    lastName: 'jabo',
    idNumber: '34080635',
    email: 'paulj@gmail.com',
    addressNumber: '54',
    addressCode: '6700',
    addressTown: 'nyali',
    phoneNumber: '0788543100'
  };

  test('POST /register should respond with new admin', async (done) => {
    try {
      const resp = await request(app)
        .post(`${BASE_URL}/register`)
        .send(testAdmin)
        .set('Authorization', `Bearer ${testMainAdmin.token}`);

      expect(resp.statusCode).toBe(201);
      expect(resp.body.data.firstName).toEqual(testAdmin.firstName);
      testAdmin = resp.body.data;
      done();
    } catch (error) {
      done(error);
    }
  });
})
