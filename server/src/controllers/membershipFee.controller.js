const prisma = require("../prisma");

const {
  getCurrentPeriod,
  getMembershipFeeSetting,
  ensureCurrentMonthFees,
} = require("../services/membershipFee.service");

function getActiveFeesWhere() {
  const { month, year } = getCurrentPeriod();

  return {
    OR: [
      {
        paid: false,
      },
      {
        month,
        year,
      },
    ],
  };
}

const getFees = async (req, res) => {
  try {
    await ensureCurrentMonthFees();

    const fees = await prisma.membershipFee.findMany({
      where: getActiveFeesWhere(),
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isActive: true,
          },
        },
      },
      orderBy: [
        {
          year: "desc",
        },
        {
          month: "desc",
        },
        {
          userId: "asc",
        },
      ],
    });

    res.json(fees);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Eroare la încărcarea cotizațiilor.",
    });
  }
};

const getUserFees = async (req, res) => {
  try {
    const { userId } = req.params;

    await ensureCurrentMonthFees();

    const fees = await prisma.membershipFee.findMany({
      where: {
        userId: Number(userId),
        ...getActiveFeesWhere(),
      },
      orderBy: [
        {
          year: "desc",
        },
        {
          month: "desc",
        },
      ],
    });

    res.json(fees);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Eroare la încărcarea cotizațiilor.",
    });
  }
};

const getFeeSettings = async (req, res) => {
  try {
    const setting = await getMembershipFeeSetting();

    res.json(setting);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Setările nu au putut fi încărcate.",
    });
  }
};

const updateFeeSettings = async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        message:
          "Suma cotizației trebuie să fie mai mare decât 0.",
      });
    }

    const setting = await prisma.clubSetting.upsert({
      where: {
        id: 1,
      },
      update: {
        membershipFeeAmount: amount,
      },
      create: {
        id: 1,
        membershipFeeAmount: amount,
      },
    });

    await ensureCurrentMonthFees();

    res.json({
      message: "Suma lunară a fost actualizată.",
      setting,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Suma lunară nu a putut fi actualizată.",
    });
  }
};

const generateCurrentFees = async (req, res) => {
  try {
    const result = await ensureCurrentMonthFees();

    res.json({
      message: "Cotizațiile lunii au fost verificate.",
      ...result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Cotizațiile lunii nu au putut fi generate.",
    });
  }
};

const updateFeeStatus = async (req, res) => {
  try {
    const { feeId } = req.params;
    const { paid } = req.body;

    if (typeof paid !== "boolean") {
      return res.status(400).json({
        message:
          "Statusul trebuie să fie true sau false.",
      });
    }

    const fee = await prisma.membershipFee.update({
      where: {
        id: Number(feeId),
      },
      data: {
        paid,
        paidAt: paid ? new Date() : null,
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
      },
    });

    res.json(fee);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Statusul cotizației nu a putut fi actualizat.",
    });
  }
};
const deleteFee = async (req, res) => {
  try {
    const feeId = Number(req.params.feeId);

    if (!Number.isInteger(feeId)) {
      return res.status(400).json({
        message: "Cotizație invalidă.",
      });
    }

    const fee = await prisma.membershipFee.findUnique({
      where: {
        id: feeId,
      },
    });

    if (!fee) {
      return res.status(404).json({
        message: "Cotizația nu există.",
      });
    }

    await prisma.membershipFee.delete({
      where: {
        id: feeId,
      },
    });

    return res.json({
      message: "Cotizația a fost ștearsă definitiv.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Cotizația nu a putut fi ștearsă.",
    });
  }
};

module.exports = {
  getFees,
  getUserFees,
  getFeeSettings,
  updateFeeSettings,
  generateCurrentFees,
  updateFeeStatus,
    deleteFee,
};