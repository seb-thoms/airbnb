
const Sequelize = require('sequelize');

const sequelize = new Sequelize('airbnb', 'edwin', '', {
  dialect: 'postgres',
  define: {
    timestamps: true,
    freezeTableName: true
  }
})

const Model = Sequelize.Model

//MODEL DEFINITIONS
class User extends Model { }
User.init({
  username: {
    type: Sequelize.STRING,
    primaryKey: true,
    field: 'username'
  },
  firstname: {
    type: Sequelize.STRING,
    field: 'firstname'
  },
  lastname: {
    type: Sequelize.STRING,
    field: 'lastname'
  },
  ishost: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    model: 'ishost'
  }
}, {
    sequelize,
    modelName: 'users',
    paranoid: true
  });

class Room extends Model { }
Room.init({
  roomid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'roomid'
  },
  hostname: {
    type: Sequelize.STRING,
    field: 'hostname'
  },
  bookstatus: {
    type: Sequelize.BOOLEAN,
    field: 'bookstatus'
  },
  location: {
    type: Sequelize.STRING,
    field: 'location',
    allowNull: false
  },
  price: {
    type: Sequelize.INTEGER,
    field: 'price',
    allowNull: false
  }
}, {
    sequelize,
    paranoid: true,
    modelName: 'rooms'
  });

class Booking extends Model { }
Booking.init({
  bookid: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'bookid'
  },
  username: {
    type: Sequelize.INTEGER,
    field: 'username'
  },
  roomid: {
    type: Sequelize.INTEGER,
    field: 'roomid'
  },
  startdate: {
    type: Sequelize.DATE,
    field: 'startdate'
  },
  enddate: {
    type: Sequelize.DATE,
    field: 'enddate'
  },
  price: {
    type: Sequelize.INTEGER,
    field: 'price'
  },
}, {
    sequelize,
    paranoid: true,
    modelName: 'bookings'
  });

User.hasMany(Room, { foreignKey: 'username', sourceKey: 'username' })
User.hasMany(Booking, { foreignKey: 'username', sourceKey: 'username' })
Booking.hasOne(Room, { foreignKey: 'roomid', sourceKey: 'roomid' })

module.exports.User = User
module.exports.Booking = Booking
module.exports.Room = Room
