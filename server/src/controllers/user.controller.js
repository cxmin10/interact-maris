const bcrypt = require("bcryptjs");
const prisma = require("../prisma");

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        attendances: {
          select: {
            id: true,
            status: true,
            cancelledAt: true,
          },
        },
        fees: {
          select: {
            id: true,
            paid: true,
          },
        },
      },
      orderBy: [
        {
          isActive: "asc",
        },
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
    });

    const formattedUsers = users.map((user) => {
      const participations = user.attendances.filter(
        (attendance) =>
          attendance.status === "PRESENT" &&
          !attendance.cancelledAt
      ).length;

      const excused = user.attendances.filter(
        (attendance) => attendance.status === "EXCUSED"
      ).length;

      const absences = user.attendances.filter(
        (attendance) => attendance.status === "ABSENT"
      ).length;

      const totalAbsences = excused + absences;

      const unpaidFees = user.fees.filter(
        (fee) => !fee.paid
      ).length;

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        photo: user.photo,
        participations,
        excused,
        absences,
        totalAbsences,
        unpaidFees,
      };
    });

    return res.json(formattedUsers);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Membrii nu au putut fi încărcați.",
    });
  }
};

const toggleUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Utilizatorul nu există.",
      });
    }

    if (req.user?.id === userId) {
      return res.status(400).json({
        message: "Nu îți poți dezactiva propriul cont.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isActive: !user.isActive,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return res.json({
      message: updatedUser.isActive
        ? "Contul a fost aprobat."
        : "Contul a fost dezactivat.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Statusul utilizatorului nu a putut fi schimbat.",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        message: "Utilizator invalid.",
      });
    }

    if (req.user?.id === userId) {
      return res.status(400).json({
        message: "Nu îți poți șterge propriul cont.",
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

    if (user.role === "ADMIN") {
      return res.status(400).json({
        message: "Un cont de administrator nu poate fi șters.",
      });
    }

    await prisma.$transaction(async (transaction) => {
      await transaction.attendance.deleteMany({
        where: {
          userId,
        },
      });

      await transaction.membershipFee.deleteMany({
        where: {
          userId,
        },
      });

      await transaction.user.delete({
        where: {
          id: userId,
        },
      });
    });

    return res.json({
      message:
        "Membrul și toate datele sale au fost șterse definitiv.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Membrul nu a putut fi șters.",
    });
  }
};
const changeUserPassword = async (req, res) => {
  try {
    const targetUserId = Number(req.params.id);
    const currentUserId = Number(req.user.id);

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!Number.isInteger(targetUserId)) {
      return res.status(400).json({
        message: "Utilizator invalid.",
      });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Parola nouă trebuie să aibă minimum 6 caractere.",
      });
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "Utilizatorul nu există.",
      });
    }

    const changingOwnPassword =
      currentUserId === targetUserId;

    if (
      !changingOwnPassword &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({
        message:
          "Nu poți schimba parola altui utilizator.",
      });
    }

    if (
      !changingOwnPassword &&
      targetUser.role === "ADMIN"
    ) {
      return res.status(403).json({
        message:
          "Nu poți schimba parola altui administrator.",
      });
    }

    if (changingOwnPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Parola actuală este obligatorie.",
        });
      }

      const passwordMatches = await bcrypt.compare(
        currentPassword,
        targetUser.password
      );

      if (!passwordMatches) {
        return res.status(400).json({
          message: "Parola actuală este incorectă.",
        });
      }
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      targetUser.password
    );

    if (samePassword) {
      return res.status(400).json({
        message:
          "Parola nouă trebuie să fie diferită de parola actuală.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await prisma.user.update({
      where: {
        id: targetUserId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.json({
      message: changingOwnPassword
        ? "Parola ta a fost modificată."
        : "Parola membrului a fost modificată.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Parola nu a putut fi modificată.",
    });
  }
};

module.exports = {
  getUsers,
  toggleUser,
  deleteUser,
  changeUserPassword,
};