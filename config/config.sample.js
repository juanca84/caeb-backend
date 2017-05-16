require('babel-core/register');


module.exports = {
    "development": {
      "username": "postgres",
      "password": "postgres",
      "database": "plantillas_db",
      "host": "localhost",
        "dialect": "postgres",
        "pool": {
            "max": 15,
            "min": 0,
            "idle": 10000,
        },
    },
    "test": {
        "username": "postgres",
        "password": "postgres",
        "database": "dircabi_test",
        "host": "localhost",
        "dialect": "postgres",
        "pool": {
            "max": 15,
            "min": 0,
            "idle": 10000,
        },
    },
    "production": {
        "username": "postgres",
        "password": "admin",
        "database": "plantillas_db",
        "host": "localhost",
        "dialect": "postgres",
        "pool": {
            "max": 15,
            "min": 0,
            "idle": 10000,
        },
    },
};
