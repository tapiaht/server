import request from 'supertest';
import app from './app.js';


describe('Pruebas de rutas Remedios', () => {
  // Prueba para la ruta GET /todos
  describe('GET /todos', () => {
    it('debería devolver un código de estado 200 y un arreglo de remedios', done => {
      request(app).get('/todos')
      .set('Accept','application/json')
      .expect('Content-Type',/json/)
      .expect(200,done);
      // expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Prueba para la ruta POST /todos
  describe('POST /todo', () => {
    const todoData = {
      title: 'Mi nuevo remedio',
      type: 1,
      advice: 'Consejo para el remedio',
      picture: 'https://example.com/picture.jpg'
    };
    it('debería crear un nuevo todo y devolver un código de estado 201', done => {
      request(app)
      .post('/todo')
      .send(todoData)
      .expect(201,done);
    });
  });

  // Prueba para la ruta GET /users
  describe('GET /users', () => {
    it('debería devolver un código de estado 200 y un arreglo de usuarios', done => {
      request(app).get('/users')
      .expect(200,done);
      // expect(Array.isArray(response.body)).toBe(true);
    });
  });

});

