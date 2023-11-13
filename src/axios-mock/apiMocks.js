// src/api/mockAPI.js
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

mock.onPost('/login').reply(200, { token: 'fake_token' });

export default axios;
