const prisma = require("../prisma");

// Afișează profilul
const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      include: {
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

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Eroare la încărcarea profilului.",
    });
  }
};

// Actualizare profil
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

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

    const user = await prisma.user.update({
      where: {
        id: Number(id),
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
    });

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Eroare la actualizarea profilului.",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};