const bcrypt = require('bcrypt');
bcrypt.hash('Admin@1234', 10).then(console.log);