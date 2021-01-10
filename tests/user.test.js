const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/users')
const {userOne, userOneId, setUpDatabase} = require('../tests/fixtures/db')

beforeEach(setUpDatabase)

test('Should signup new user', async ()=>{
    const response = await request(app).post('/users').send({
        "name": "Utkarsh Lath",
        "email": "utkarshlath@exxxample.com",
        "password": "JaiMataDi1"
    }).expect(201)

    //Assert that database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: "Utkarsh Lath",
            email: "utkarshlath@exxxample.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('JaiMataDi1')
})

test('Should login existing user', async ()=>{
    const response = await request(app).post('/users/login').send({
        "email": userOne.email,
        "password": userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non existent user', async ()=>{
    await request(app).post('/users/login').send({
        "email": userOne.email,
        "password": "nothispassword"
    }).expect(404)
})

test('Should get profile for user', async ()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async ()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete profile for user', async ()=>{
    await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete profile for unauthenticated user', async ()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async ()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async ()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Jassi"
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual("Jassi")
})

test('Should not update invalid user field', async ()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "India"
        })
        .expect(400)
})