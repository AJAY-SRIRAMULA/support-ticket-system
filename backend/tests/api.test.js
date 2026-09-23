import request from 'supertest';
import app from '../app.js';

describe('API contract',()=>{
  test('health endpoint is public',async()=>{const r=await request(app).get('/api/health');expect(r.statusCode).toBe(200);expect(r.body.status).toBe('ok')});
  test('protected tickets endpoint rejects missing token',async()=>{const r=await request(app).get('/api/tickets');expect(r.statusCode).toBe(401)});
  test('protected users endpoint rejects missing token',async()=>{const r=await request(app).get('/api/users');expect(r.statusCode).toBe(401)});
  test('invalid login validates input',async()=>{const r=await request(app).post('/api/auth/login').send({email:'bad'});expect(r.statusCode).toBe(400)});
  test('registration validates short password',async()=>{const r=await request(app).post('/api/auth/register').send({name:'Test',email:'new@example.com',password:'123'});expect(r.statusCode).toBe(400)});
  test('unknown route returns 404 JSON',async()=>{const r=await request(app).get('/api/not-a-route');expect(r.statusCode).toBe(404);expect(r.body.message).toBe('Route not found')});
  test('ticket creation without authentication is rejected',async()=>{const r=await request(app).post('/api/tickets').send({subject:'Test',description:'Test'});expect(r.statusCode).toBe(401)});
  test('comment creation without authentication is rejected',async()=>{const r=await request(app).post('/api/tickets/1/comments').send({comment:'Test'});expect(r.statusCode).toBe(401)});
});
