const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  createUser,
  findUserByEmail,
} = require("../services/user.service");

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "Toate câmpurile sunt obligatorii.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Parola trebuie să aibă cel puțin 6 caractere.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await findUserByEmail(
      normalizedEmail
    );

    if (existingUser) {
      return res.status(409).json({
        message: "Există deja un cont cu acest email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "MEMBER",
      isActive: false,
    });

    return res.status(201).json({
      message:
        "Contul a fost creat și așteaptă aprobarea administratorului.",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Eroare la crearea utilizatorului.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Emailul și parola sunt obligatorii.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(
      normalizedEmail
    );

    if (!user) {
      return res.status(401).json({
        message: "Email sau parolă incorectă.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email sau parolă incorectă.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message:
          "Contul tău așteaptă aprobarea administratorului.",
        pendingApproval: true,
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      message: "Autentificare reușită!",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Eroare la autentificare.",
    });
  }
};