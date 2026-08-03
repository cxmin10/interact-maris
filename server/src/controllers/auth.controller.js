const bcrypt = require("bcryptjs");
const {
  createUser,
  findUserByEmail,
} = require("../services/user.service");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Verificăm dacă toate câmpurile există
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "Toate câmpurile sunt obligatorii.",
      });
    }
const existingUser = await findUserByEmail(email);

if (existingUser) {
  return res.status(409).json({
    message: "Există deja un cont cu acest email.",
  });
}
    // Criptăm parola
    const hashedPassword = await bcrypt.hash(password, 10);

    // Salvăm utilizatorul în baza de date
    const user = await createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Utilizator creat cu succes!",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Eroare la crearea utilizatorului.",
    });
  }
};