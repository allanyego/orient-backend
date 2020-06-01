const request = require('supertest');

const app = require('../app');
const controller = require('../controllers/insurers');
const adminCtrl = require('../controllers/admins');
const db = require('../db');

const CLIENTS_URL = '/api/v1/clients';
const POLICIES_URL = '/api/v1/policies';
let testClient, testInsurer;
let testAdmin = {
  firstName: 'paul',
  middleName: 'mbabo',
  lastName: 'kale',
  email: 'paulkale@gmail.com',
  idNumber: '30065635',
  addressNumber: '37',
  addressCode: '400',
  addressTown: 'bungoma',
  phoneNumber: '0788000122'
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

  // Create a test insurer
  testInsurer = await controller.create({
    name: 'test inc',
    addressNumber: '48',
    addressCode: '490',
    addressTown: 'Kilifi',
    phoneNumber: '0721356440',
  });

  testClient = {
    firstName: 'mike',
    middleName: 'mro',
    lastName: 'bambini',
    idNumber: '34562563',
    email: 'miake@gmail.com',
    phoneNumber: '0719726772',
    addressNumber: '34',
    addressCode: '34672',
    addressTown: 'eldoret',
    kraPin: 'A000000777I',
    insurer: testInsurer.id,
    occupation: 'farmer',
    policy: {
      policyNumber: 'mmm/56356/9098',
      policyPeriod: {
        start: new Date(),
        end: new Date(),
      },
      policyClass: 'vehicle',
      sumInsured: 850000,
      premiumRate: 5,
      pvt: 4000,
      excessProtection: true,
      antiTheftCoverage: false,
      rookie: false,
      passengersPllCoverage: false,
      vehicle: {
        registrationNumber: 'kba 778e',
        make: 'mazda',
        bodyType: 'truck',
        bodyColor: 'black',
        manufactureYear: new Date('2010'),
        chasisNumber: 'yur999i88',
        engineNumber: 't000ytyu66u',
        ratingCc: '1200',
        tonnage: 'general cartage'
      }
    },
  };
});

describe('Client operations /clients', () => {
  test('GET / should return an array', async (done) => {
    try {
      const resp = await request(app)
        .get(CLIENTS_URL);
      expect(resp.statusCode).toBe(200);
      expect(resp.body.data).toBeDefined();
      done();
    } catch (error) {
      done(error);
    }
  });

  test('POST / should return created client', async (done) => {
    try {
      const resp = await request(app)
        .post(CLIENTS_URL)
        .send(testClient)
        .set('Authorization', `Bearer ${testAdmin.token}`);

      expect(resp.statusCode).toBe(201);
      expect(resp.body.data.firstName).toEqual(testClient.firstName);
      expect(resp.body.data.policy).toBeDefined();
      expect(resp.body.data.policy.vehicle).toBeDefined();
      testClient = resp.body.data;

      done();
    } catch (error) {
      done(error);
    }
  });
});

describe('Policy operations /policies', () => {
  test('PUT /:policyId should respond with success status', async (done) => {
    try {
      const resp = await request(app)
        .put(`${POLICIES_URL}/${testClient.policy.id}`)
        .send({
          approved: true,
        })
        .set('Authorization', `Bearer ${testAdmin.token}`);

      expect(resp.statusCode).toBe(200);
      done();
    } catch (error) {
      done(error);
    }
  });

  test('POST / should respond with created policy', async (done) => {
    const policy2 = {
      client: testClient.id,
      insurer: testInsurer.id,
      policyNumber: 'mmm/56356/1001',
      policyPeriod: {
        start: new Date(),
        end: new Date(new Date().getTime() + 20000000000),
      },
      policyClass: 'fire',
      sumInsured: 850000,
      premiumRate: 4.5,
      pvt: 4000,
    };

    try {
      const resp = await request(app)
        .post(POLICIES_URL)
        .send(policy2)
        .set('Authorization', `Bearer ${testAdmin.token}`);

      expect(resp.statusCode).toBe(201);
      done();
    } catch (error) {
      done(error);
    }
  });

  test('POST / should respond with created policy', async (done) => {
    const policy2 = {
      client: testClient.id,
      insurer: testInsurer.id,
      policyNumber: 'mnn/56356/2019',
      policyPeriod: {
        start: new Date(),
        end: new Date(new Date().getTime() + 20000000000),
      },
      policyClass: 'fire',
      sumInsured: 5000000,
      premiumRate: 4.5,
      pvt: 14000,
    };

    try {
      const resp = await request(app)
        .post(POLICIES_URL)
        .send(policy2)
        .set('Authorization', `Bearer ${testAdmin.token}`);

      expect(resp.statusCode).toBe(201);
      done();
    } catch (error) {
      done(error);
    }
  });

  test('GET ?insurer=insurerId responds with policies of insurer', async (done) => {
    try {
      const resp = await request(app)
        .get(`${POLICIES_URL}?insurer=${testInsurer.id}`);

      expect(resp.statusCode).toBe(200);
      expect(resp.body.data).toBeDefined();
      done();
    } catch (error) {
      done(error);
    }
  });

  test('GET ?client=clientId responds with policies of client', async (done) => {
    try {
      const resp = await request(app)
        .get(`${POLICIES_URL}?client=${testClient.id}`);

      expect(resp.statusCode).toBe(200);
      expect(resp.body.data).toBeDefined();
      done();
    } catch (error) {
      done(error);
    }
  });

  test('GET /:policyId/vehicle responds with vehicle attached to policy', async (done) => {
    try {
      const resp = await request(app)
        .get(`${POLICIES_URL}/${testClient.policy.id}/vehicle`);

      expect(resp.statusCode).toBe(200);
      expect(resp.body.data.registrationNumber).toBeDefined();
      done();
    } catch (error) {
      done(error);
    }
  });

  test('GET ?type=new should respond with policies of given type', async (done) => {
    try {
      const resp = await request(app)
        .get(`${POLICIES_URL}?type=new`);

      expect(resp.statusCode).toBe(200);
      expect(resp.body.data[0]).toBeDefined();
      done();
    } catch (error) {
      done(error);
    }
  });

  test('PUT /:policyId/renew should respond with success status', async (done) => {
    try {
      const yesterday = new Date(Date.now() - 86400);
      await db.query("UPDATE policies SET policy_period_end=$1", [yesterday]);

      const resp = await request(app)
        .put(`${POLICIES_URL}/${testClient.policy.id}/renew`)
        .send(null)
        .set('Authorization', `Bearer ${testAdmin.token}`);

      expect(resp.statusCode).toBe(200);
      expect(resp.body.data.type).toBe("renewal");
      done();
    } catch (error) {
      done(error);
    }
  });
});
