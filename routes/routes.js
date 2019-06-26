const controllers = require('./../controllers/controllers')
const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);

module.exports = [

  //INDEX PAGE
  {
    method: 'GET',
    path: '/',
    handler: controllers.index
  },

  //ADD USER
  {
    method: 'POST',
    path: '/adduser',
    handler: controllers.adduser,
    options: {
      validate: {
        payload: {
          username: Joi.string().alphanum().min(3).max(30).required(),
          firstname: Joi.string().required(),
          lastname: Joi.string().required(),
          ishost: Joi.boolean().required()
        }
      }
    }
  },

  //CREATE ROOM
  {
    method: 'POST',
    path: '/createroom/{username}',
    handler: controllers.createroom,
    options: {
      validate: {
        params: {
          username: Joi.string().alphanum().min(3).max(30).required()
        },
        payload: {
          location: Joi.string().required(),
          price: Joi.number().required(),
        }
      }
    }
  },

  //VIEW ROOM
  {
    method: 'GET',
    path: '/viewroom/{username}',
    /*config: {
      plugins: {
        pagination: {
          enabled: true
        }
      }
    },*/
    handler: controllers.viewroom
  },

  //BOOK ROOM
  {
    method: 'POST',
    path: '/bookroom/{username}/{roomid}',
    handler: controllers.bookroom,
    options: {
      validate: {
        params: {
          username: Joi.string().alphanum().min(3).max(30),
          roomid: Joi.number().required()
        },
        query: {
          startdate: Joi.date().iso(),
          enddate: Joi.date().iso().min(Joi.ref('startdate')).error(new Error('startdate should come before enddate'))
        }
      }
    }
  },

  //VIEW USER
  {
    method: 'GET',
    path: '/viewuser/{username}',
    handler: controllers.viewuser
  },

  //VIEW BOOKINGS
  {
    method: 'GET',
    path: '/viewbooking/{username}',
    handler: controllers.viewbooking
  },

  //CANCEL BOOKING
  {
    method: 'POST',
    path: '/cancel/{username}/{bookid}',
    handler: controllers.cancelbooking,
    options: {
      validate: {
        params: {
          username: Joi.string().alphanum().min(3).max(30),
          bookid: Joi.number().required()
        }
      }
    }
  },

  //404 ERRORS
  {
    method: ['GET', 'POST'],
    path: '/{any*}',
    handler: controllers.error404
  },

  //I'M A TEAPOT
  {
    method: ['GET', 'POST'],
    path: '/teapot',
    handler: controllers.teapot
  }
]