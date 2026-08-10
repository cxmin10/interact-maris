const prisma = require("../prisma");

const addAbsence = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const { type } = req.body;

    if (!["EXCUSED", "UNEXCUSED"].includes(type)) {
      return res.status(400).json({
        message: "Tip de absență invalid.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Utilizatorul nu există.",
      });
    }

    const absence = await prisma.absence.create({
      data: {
        userId,
        type,
      },
    });

    return res.status(201).json(absence);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Absența nu a putut fi adăugată.",
    });
  }
};

const getUserAbsences = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const absences = await prisma.absence.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(absences);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Absențele nu au putut fi încărcate.",
    });
  }
};

const deleteAbsence = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const absence = await prisma.absence.findUnique({
      where: {
        id,
      },
    });

    if (!absence) {
      return res.status(404).json({
        message: "Absența nu există.",
      });
    }

    await prisma.absence.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Absența a fost ștearsă.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Absența nu a putut fi ștearsă.",
    });
  }
};

module.exports = {
  addAbsence,
  getUserAbsences,
  deleteAbsence,
};