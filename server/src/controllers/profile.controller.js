const prisma = require("../prisma");

// Afișează profilul
const getProfile = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "ID utilizator invalid.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        isDeleted: true,

        phone: true,
        birthDate: true,
        school: true,
        position: true,
        address: true,
        instagram: true,
        facebook: true,
        photo: true,
        description: true,

        createdAt: true,

        attendances: {
          include: {
            event: true,
          },
          orderBy: {
            registeredAt: "desc",
          },
        },

        fees: {
          orderBy: [
            {
              year: "desc",
            },
            {
              month: "desc",
            },
          ],
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Utilizatorul nu există.",
      });
    }

    return res.json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Eroare la încărcarea profilului.",
    });
  }
};

// Actualizare profil
const updateProfile = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "ID utilizator invalid.",
      });
    }

    const {
      firstName,
      lastName,
      phone,
      school,
      position,
      address,
      instagram,
      facebook,
      photo,
      description,
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "Utilizatorul nu există.",
      });
    }

    const user = await prisma.user.update({
      where: {
        id,
      },

      data: {
        firstName,
        lastName,
        phone,
        school,
        position,
        address,
        instagram,
        facebook,
        photo,
        description,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        isDeleted: true,

        phone: true,
        birthDate: true,
        school: true,
        position: true,
        address: true,
        instagram: true,
        facebook: true,
        photo: true,
        description: true,

        createdAt: true,
      },
    });

    return res.json({
      message: "Profilul a fost actualizat.",
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Eroare la actualizarea profilului.",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};