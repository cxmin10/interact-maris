const prisma = require("../prisma");

// Toate evenimentele
const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        attendances: {
          where: {
            cancelledAt: null,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const formattedEvents = events.map((event) => ({
      ...event,
      participantsCount: event.attendances.length,
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Eroare la încărcarea evenimentelor.",
    });
  }
};

// Un singur eveniment
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!event) {
      return res.status(404).json({
        message: "Evenimentul nu există.",
      });
    }

    res.json(event);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Eroare.",
    });
  }
};

// Creare eveniment
const createEvent = async (req, res) => {
  try {
    const { title, description, location, date } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Eroare la crearea evenimentului.",
    });
  }
};

// Editare eveniment
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, date } = req.body;

    const event = await prisma.event.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        description,
        location,
        date: new Date(date),
      },
    });

    res.json(event);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Eroare la actualizare.",
    });
  }
};

// Ștergere eveniment
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Eveniment șters.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Eroare la ștergere.",
    });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};