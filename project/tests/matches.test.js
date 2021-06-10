const DButils = require('../routes/utils/DButils')
const auth_utils = require('../routes/utils/auth_utils')
const request = require('supertest');
const app = require('../main')
const sql = require('mssql')
var user = request.agent(app)
require("dotenv").config();
const axios = require('axios');
const bcryptjs = require('bcryptjs');
const { response } = require('express');
const localhost = "http://localhost:3000"

////////////////// UNIT TESTING //////////////////////


////////////////// Acceptance Testing //////////////////



describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
})
