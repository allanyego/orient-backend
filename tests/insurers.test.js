const request = require('supertest');

const app = require('../app');
const adminCtrl = require('../controllers/admins');

const BASE_URL = '/api/v1/insurers';
let testAdmin = {
  firstName: 'paul',
  lastName: 'obado',
  email: 'obapo@gmail.com',
  idNumber: '30067635',
  addressNumber: '7',
  addressCode: '5400',
  addressTown: 'nairobi',
  phoneNumber: '0788043222'
};

beforeAll(async () => {
  testAdmin = await adminCtrl.create(testAdmin);
  await adminCtrl.editPassword({
    adminId: testAdmin.id,
    newPassword: 'paulkale8'
  });
  testAdmin = await adminCtrl.authenticate({
    email: testAdmin.email,
    password: 'paulkale8'
  });
});

describe('Insurer operations', () => {
  test('GET /insurers returns an array', async (done) => {
    try {
      const resp = await request(app)
        .get(BASE_URL);
      expect(resp.statusCode).toBe(200);
      expect(resp.body.data).toBeDefined();
      done();
    } catch (error) {
      done(error);
    }
  });

  let testInsurer = {
    name: 'andys inc',
    addressNumber: '44',
    addressCode: '300',
    addressTown: 'Kilifi',
    phoneNumber: '0721356420',
  };

  test('POST /insurers returns created user', async (done) => {
    try {
      const resp = await request(app)
        .post(BASE_URL)
        .send(testInsurer)
        .set('Authorization', `Bearer ${testAdmin.token}`);

      expect(resp.statusCode).toBe(201);
      expect(resp.body.data.name).toEqual(testInsurer.name);
      testInsurer = resp.body.data;
      done();
    } catch (error) {
      done(error);
    }
  });

  test('GET /insurers/:insurerId returns insurer of given id', async (done) => {
    try {
      const resp = await request(app)
        .get(`${BASE_URL}/${testInsurer.id}`);
      expect(resp.statusCode).toBe(200);
      expect(resp.body.data.name).toBeDefined();
      done();
    } catch (error) {
      done(error);
    }
  });
});