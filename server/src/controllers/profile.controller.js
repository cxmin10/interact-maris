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
    console.error(
      "GET PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Eroare la încărcarea profilului.",
    });
  }
};

// Editare profil - doar admin
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

    const existingUser =
      await prisma.user.findUnique({
        where: {
          id,
        },
      });

    if (!existingUser) {
      return res.status(404).json({
        message:
          "Utilizatorul nu există.",
      });
    }

    const user =
      await prisma.user.update({
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
      message:
        "Profilul a fost actualizat.",
      user,
    });
  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Eroare la actualizarea profilului.",
    });
  }
};

// Schimbare fotografie profil
const updateProfilePhoto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { photo } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "ID utilizator invalid.",
      });
    }

    const loggedUserId = Number(req.user?.id);
    const isAdmin =
      req.user?.role === "ADMIN";

    const isOwnProfile =
      loggedUserId === id;

    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({
        message:
          "Nu poți modifica fotografia altui utilizator.",
      });
    }

    if (
      photo &&
      !photo.startsWith("https://") &&
      !photo.startsWith("http://")
    ) {
      return res.status(400).json({
        message:
          "Linkul fotografiei trebuie să înceapă cu http:// sau https://",
      });
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          id,
        },
      });

    if (!existingUser) {
      return res.status(404).json({
        message:
          "Utilizatorul nu există.",
      });
    }

    const user =
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          photo: photo || null,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          photo: true,
        },
      });

    return res.json({
      message:
        "Fotografia a fost actualizată.",
      user,
    });
  } catch (error) {
    console.error(
      "UPDATE PHOTO ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Fotografia nu a putut fi actualizată.",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateProfilePhoto,
};