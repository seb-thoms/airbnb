const Sequelize = require('sequelize');
const Models = require('./../models/models')
const User = Models.User
const Room = Models.Room
const Booking = Models.Booking

const Op = Sequelize.Op

//PAGINATION
const paginate = ({ page, pageSize }) => {
  const offset = page * pageSize
  const limit = offset + pageSize

  return {
    offset,
    limit,
  }
}

module.exports = {
  //ADD USER
  adduser: async function (payload) {
    let success = true
    try {
      await User.create({
        username: payload['username'],
        firstname: payload['firstname'],
        lastname: payload['lastname'],
        ishost: JSON.parse(payload['ishost'])
      })
    }
    catch (err) {
      console.log(err)
      success = false
    }
    return success
  },

  //CHECK HOST STATUS
  hoststatus: async function (username) {
    const hoststatus = await User.findOne({
      where: {
        username: username
      },
      attributes: ['ishost']
    })
    return hoststatus.ishost
  },

  //CREATE ROOM
  createroom: async function (payload, username) {
    let success = true
    try {
      await Room.create({
        hostname: username,
        location: payload['location'],
        price: payload['price']
      })
    }
    catch (err) {
      console.log(err)
      success = false
    }
    return success
  },

  //VIEW ROOM
  viewroom: async function (username) {
    const rooms = await Room.findAll({
      where: {
        bookstatus: false,
        hostname: { [Op.ne]: username }
      },
      attributes: ['roomid', 'hostname', 'location', 'price'],
      offset: 0,
      limit: 5
      //paginate({ page, pageSize })
    })
    return rooms
  },

  //TO RETURN DETAILS OF A ROOM
  getroom: async function (roomid) {
    let price = await Room.findOne({
      where: {
        roomid: roomid
      },
      attributes: ['price', 'hostname', 'bookstatus']
    })
    return price
  },

  //BOOK ROOM
  bookroom: async function (startdate, enddate, username, roomid, price) {
    let success = true
    try {
      await Booking.create({
        username: username,
        roomid: roomid,
        startdate,
        enddate,
        price,
      })
    }
    catch (err) {
      console.log(err)
      success = false
    }
    Room.update(
      { bookstatus: true },
      { where: { roomid: roomid } }
    )
    //console.log(typeof (params['enddate']))
    //console.log(params['enddate'] - params['startdate'])
    if (success) {
      return true
    }
    return false
  },

  //VIEW USER
  viewuser: async function (username) {
    const user = await User.findOne({
      where: {
        username: username
      },
      attributes: ['username', 'firstname', 'lastname', 'ishost']
    })
    return user
  },

  //HOSTED ROOM
  hostroom: async function (username) {
    const room = await Room.findAll({
      where: {
        hostname: username
      },
      attributes: ['roomid', 'location', 'price', 'bookstatus']
    })
    return room
  },

  //VIEW BOOKING
  viewbooking: async function (username) {
    const booking = await Booking.findAll({
      where: {
        username: username
      },
      attributes: ['username', 'roomid', 'startdate', 'enddate', 'price', 'bookid']
    })
    return booking
  },

  //CANCEL BOOKING
  cancelbooking: async function (bookid) {
    let success = true
    try {
      const room = await Booking.findOne({
        where: {
          bookid: bookid
        },
        attributes: ['roomid']
      })
      await Room.update(
        { bookstatus: false },
        { where: { roomid: room.roomid } }
      )
    }
    catch (err) {
      console.log(err)
      success = false
    }
    await Booking.destroy({
      where: {
        bookid: bookid
      }
    })
    return success

  }
}