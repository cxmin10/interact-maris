const prisma = require("../prisma");

async function createUser(data) {
  return prisma.user.create({
    data,
  });
}

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

module.exports = {
  createUser,
  findUserByEmail,
};