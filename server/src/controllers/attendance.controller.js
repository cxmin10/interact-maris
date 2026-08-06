const prisma = require("../prisma");

const VALID_STATUSES = ["PRESENT", "ABSENT", "EXCUSED"];

const registerToEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user?.id || Number(req.body.userId);

    if (!userId || !eventId) {
      return res.status(400).json({
        message: "Utilizatorul și evenimentul sunt obligatorii.",
      });
    }

    const event = await prisma.event.findUnique({
      where: {
        id: Number(eventId),
      },
    });

    if (!event) {
      return res.status(404).json({
        message: "Evenimentul nu există.",
      });
    }

    const existingAttendance =
      await prisma.attendance.findUnique({
        where: {
          userId_eventId: {
            userId: Number(userId),
            eventId: Number(eventId),
          },
        },
      });

    if (existingAttendance) {
      if (!existingAttendance.cancelledAt) {
        return res.status(409).json({
          message: "Ești deja înscris la acest eveniment.",
        });
      }

      const restoredAttendance =
        await prisma.attendance.update({
          where: {
            id: existingAttendance.id,
          },
          data: {
            status: "PRESENT",
            reason: null,
            cancelledAt: null,
            registeredAt: new Date(),
          },
        });

      return res.json(restoredAttendance);
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId: Number(userId),
        eventId: Number(eventId),
        status: "PRESENT",
      },
    });

    return res.status(201).json(attendance);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Înscrierea nu a putut fi realizată.",
    });
  }
};

const getUserAttendances = async (req, res) => {
  try {
    const requestedUserId = Number(req.params.userId);

    if (
      req.user?.role !== "ADMIN" &&
      req.user?.id !== requestedUserId
    ) {
      return res.status(403).json({
        message: "Nu poți vedea participările altui utilizator.",
      });
    }

    const attendances = await prisma.attendance.findMany({
      where: {
        userId: requestedUserId,
      },
      include: {
        event: true,
      },
      orderBy: {
        event: {
          date: "desc",
        },
      },
    });

    return res.json(attendances);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Participările nu au putut fi încărcate.",
    });
  }
};

const cancelAttendance = async (req, res) => {
  try {
    const { eventId, reason } = req.body;
    const userId = req.user?.id || Number(req.body.userId);

    if (!userId || !eventId) {
      return res.status(400).json({
        message: "Date incomplete.",
      });
    }

    if (!reason?.trim()) {
      return res.status(400).json({
        message: "Motivul retragerii este obligatoriu.",
      });
    }

    const attendance =
      await prisma.attendance.findUnique({
        where: {
          userId_eventId: {
            userId: Number(userId),
            eventId: Number(eventId),
          },
        },
      });

    if (!attendance) {
      return res.status(404).json({
        message: "Participarea nu există.",
      });
    }

    const updatedAttendance =
      await prisma.attendance.update({
        where: {
          id: attendance.id,
        },
        data: {
          reason: reason.trim(),
          cancelledAt: new Date(),
          status: "EXCUSED",
        },
      });

    return res.json(updatedAttendance);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Participarea nu a putut fi anulată.",
    });
  }
};

const getParticipants = async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);

    const participants = await prisma.attendance.findMany({
      where: {
        eventId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            photo: true,
          },
        },
      },
      orderBy: [
        {
          cancelledAt: "asc",
        },
        {
          registeredAt: "asc",
        },
      ],
    });

    return res.json(participants);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Participanții nu au putut fi încărcați.",
    });
  }
};

const updateAttendanceStatus = async (req, res) => {
  try {
    const attendanceId = Number(req.params.attendanceId);
    const { status } = req.body;

    if (!Number.isInteger(attendanceId)) {
      return res.status(400).json({
        message: "Participare invalidă.",
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message:
          "Statusul trebuie să fie PRESENT, ABSENT sau EXCUSED.",
      });
    }

    const existingAttendance =
      await prisma.attendance.findUnique({
        where: {
          id: attendanceId,
        },
      });

    if (!existingAttendance) {
      return res.status(404).json({
        message: "Participarea nu există.",
      });
    }

    const attendance = await prisma.attendance.update({
      where: {
        id: attendanceId,
      },
      data: {
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        event: true,
      },
    });

    return res.json({
      message: "Statusul prezenței a fost actualizat.",
      attendance,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Statusul prezenței nu a putut fi actualizat.",
    });
  }
};

module.exports = {
  registerToEvent,
  getUserAttendances,
  cancelAttendance,
  getParticipants,
  updateAttendanceStatus,
};