const prisma = require("../prisma");

function getCurrentPeriod() {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const dueDate = new Date(
    year,
    now.getMonth() + 1,
    1,
    0,
    0,
    0,
    0
  );

  return {
    month,
    year,
    dueDate,
  };
}

async function getMembershipFeeSetting() {
  return prisma.clubSetting.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      id: 1,
      membershipFeeAmount: 0,
    },
  });
}

async function ensureCurrentMonthFees() {
  const setting = await getMembershipFeeSetting();

  const amount = Number(setting.membershipFeeAmount);

  if (!amount || amount <= 0) {
    return {
      created: 0,
      updated: 0,
      message: "Suma lunară nu este configurată.",
    };
  }

  const { month, year, dueDate } = getCurrentPeriod();

  const members = await prisma.user.findMany({
    where: {
      role: "MEMBER",
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  let created = 0;
  let updated = 0;

  for (const member of members) {
    const existingFee =
      await prisma.membershipFee.findFirst({
        where: {
          userId: member.id,
          month,
          year,
        },
      });

    if (!existingFee) {
      await prisma.membershipFee.create({
        data: {
          userId: member.id,
          month,
          year,
          amount,
          paid: false,
          paidAt: null,
          dueDate,
        },
      });

      created += 1;
      continue;
    }

    if (!existingFee.paid) {
      await prisma.membershipFee.update({
        where: {
          id: existingFee.id,
        },
        data: {
          amount,
          dueDate,
        },
      });

      updated += 1;
    }
  }

  return {
    created,
    updated,
    month,
    year,
  };
}

function startMembershipFeeScheduler() {
  async function runGeneration() {
    try {
      const result = await ensureCurrentMonthFees();

      console.log(
        "Verificare automată cotizații:",
        result
      );
    } catch (error) {
      console.error(
        "Eroare la generarea automată a cotizațiilor:",
        error
      );
    }
  }

  runGeneration();

  const oneHour = 60 * 60 * 1000;

  return setInterval(runGeneration, oneHour);
}

module.exports = {
  getCurrentPeriod,
  getMembershipFeeSetting,
  ensureCurrentMonthFees,
  startMembershipFeeScheduler,
};