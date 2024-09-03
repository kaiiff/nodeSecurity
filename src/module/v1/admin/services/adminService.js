const Admin = require("../../user/models/userModel");
const bcrypt = require("bcrypt");

async function hashingPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

async function checkUserExists(email) {  
  return await Admin.findOne({ email });
}

async function createAdmin({ name, email, password, role, picUrls }) {
  if (role !== "admin") {
    throw new Error("Please signup as user!");
  }

  const existingUser = await checkUserExists(email);
  if (existingUser) {
    throw new Error(
      "This email is already registered. Please use a different email."
    );optimize
  }

  const hash = await hashingPassword(password);
  const newAdmin = new Admin({
    name,
    email,
    password: hash,
    role,
    pic: picUrls.length
      ? picUrls
      : [
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        ],
  });

  return await newAdmin.save();
}

async function loginAdmin({ email, password, role }) {
  if (role !== "admin") {
    throw new Error("Please signup as user!");
  }

  const existingUser = await checkUserExists(email);
  if (existingUser) {
    throw new Error(
      "This email is already registered. Please use a different email."
    );
  }
}

module.exports = {
  createAdmin,
};
