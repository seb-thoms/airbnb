const Boom = require('@hapi/boom')
const Moment = require('moment')
const Services = require('./../services/services')

module.exports = {
  //INDEX PAGE
  index: (request, reply) => {
    const data = {
      msg: "Welcome to AirBnB",
    }
    return reply.response(data).code(200)
  },

  //ADD USER
  adduser: async (request, reply) => {
    let data = { msg: '' }
    const payload = request.payload
    success = await Services.adduser(payload)
    //console.log('asdsada', success, typeof (success))
    if (success) {
      if (JSON.parse(payload['ishost'])) {
        data.msg = 'Host successfully created. ' + payload['username'] + ' can create rooms now.'
        return reply.response(data).code(201)
      }
      data.msg = 'User successsfully created. ' + payload['username'] + ' Welcome to airbnb.'
      return reply.response(data).code(201)
    }
    data.msg = 'User id in use'
    return reply.response(data).code(200)
  },

  //CREATE ROOM
  createroom: async (request, reply) => {
    let data = { msg: '' }
    hoststatus = await Services.hoststatus(request.params.username)
    if (!hoststatus) {
      return Boom.unauthorized('You are not authorized to create rooms')
    }
    //console.log(hoststatus)
    const payload = request.payload
    const success = await Services.createroom(payload, request.params.username)
    console.log(success)
    if (success) {
      data.msg = 'Room created succesfully'
      return reply.response(data).code(201)
    }
    return Boom.badImplementation('Error in creating room')
  },

  //VIEW ROOMS
  viewroom: async (request, reply) => {
    const rooms = await Services.viewroom(request.params.username)
    return rooms
  },

  //BOOK ROOMS
  bookroom: async (request, reply) => {
    let { startdate, enddate } = request.query;
    let data = { msg: '' }
    // const params = request.query
    // let startdate = params['startdate']
    // let enddate = params['enddate']
    startdate = Moment(startdate);
    enddate = Moment(enddate);
    const days = enddate.diff(startdate, 'days');
    //console.log(days)
    //console.log(startdate, enddate)
    let room = await Services.getroom(request.params.roomid)
    console.log(JSON.parse(JSON.stringify(room)))
    if (room.bookstatus == true) {
      data.msg = 'Room is already booked.'
      return reply.response(data).code(200)
    }
    if (room.hostname == request.params.username) {
      return Boom.badRequest('You cannot book rooms hosted by you')
    }
    let price = room.price * days
    console.log(startdate)
    let success = await Services.bookroom(startdate, enddate, request.params.username, request.params.roomid, price)
    if (success) {
      data.msg = 'Booking success'
      return reply.response(data).code(201)
    }
    return Boom.badImplementation('Booking failed')
  },

  //VIEW USER
  viewuser: async (request, reply) => {
    let data = {}
    const user = await Services.viewuser(request.params.username)
    //console.log(user)
    console.log('global>>>>>>>', global.price)

    const booking = await Services.viewbooking(request.params.username)
    //console.log(booking)

    if (user.ishost) {
      const room = await Services.hostroom(request.params.username)
      data.userDetails = user
      data.roomsHosted = room
      data.booking = booking
      return reply.response(data).code(200)
    }
    data.userDetails = user
    data.booking = booking
    return reply.response(data).code(200)
  },

  //VIEW BOOKING
  viewbooking: async (request, reply) => {
    const booking = await Services.viewbooking(request.params.username)
    return booking
  },

  //CANCEL BOOKING
  cancelbooking: async (request, reply) => {
    const cancelstatus = await Services.cancelbooking(request.params.bookid)
    if (cancelstatus) {
      const data = {
        msg: 'Booking successfully cancelled'
      }
      return reply.response(data).code(200)
    }
    return Boom.badImplementation('Error in cancellation')
  },

  //404 ERRORS
  error404: (request, reply) => {
    const accept = request.headers.accept

    if (accept && accept.match()) {
      return Boom.notFound('Oh snap... Resource not found')
    }
  },

  //I'M A TEAPOT
  teapot: (request, reply) => {
    return Boom.teapot('I\'m a teapot....')
  }
}