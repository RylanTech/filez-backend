import { RequestHandler } from "express";
import { User } from "../models/users";
import { comparePasswords, hashPassword } from "../services/auth";
import {
  signUserToken,
  verifyUser,
  verifyToken,
} from "../services/authService";

export const allUser: RequestHandler = async (req, res, next) => {
  let users = await User.findAll();
  res.status(200).json(users);
};

export const createUser: RequestHandler = async (req, res, next) => {
let newUser: User = req.body;

if (newUser.email && newUser.password && newUser.name) {
    newUser.userType = 'admin'
    
    let hashedPassword = await hashPassword(newUser.password);
    newUser.password = hashedPassword;

    let create = await User.create(newUser);
    res.status(200).json({
      email: create.email,
      userId: create.userId,
    });
  } else {
    res.status(400).send("Missing feilds");
  }
};
//         userId: create.userId,
//       });
//     } else {
//       res.status(400).send("Missing feilds");
//     }

//   } else {
//     res.status(401).send("Not Authurized")
//   }
export const signInUser: RequestHandler = async (req, res, next) => {
  let validUser: User | null = await User.findOne({
    where: { email: req.body.email },
  });
  if (validUser) {
    // add authentication
    let matchPass = await comparePasswords(
      req.body.password,
      validUser.password
    );


    if (matchPass) {
      // if pass matches, generate token
      let token = await signUserToken(validUser);
      res.status(200).json({ token, userId: validUser.userId });
    } else {
      res.status(401).json("Password invalid");
    }
  } else {
    res.status(401).json("Email invalid");
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  // const currentDate = new Date().toISOString().slice(0, 10);
  let usr = req.params.id;
  let user = await User.findByPk(usr)
  res.status(200).json(user);
};

export const modifyUser: RequestHandler = async (req, res, next) => {
  try {
    let newUser = req.body;
    let user = await verifyUser(req);
  
    //Does the user exist? if yes contiune
    if (!user) {
      return res.status(403).send("No user signed in");
    }
  
    let userId = parseInt(req.params.id);
    newUser.userId = userId
  
    //Is the user making the edit the same user editing themselves? if yes continue
    if (user.userType === "admin") {
      let foundUser = await User.findByPk(userId);
      if (!foundUser) {
        return res.status(404).send();
      }
    
      if (newUser.password) {
        newUser.password = await hashPassword(newUser.password)
      } else {
        newUser.password = foundUser.password;
      }
  
      if (!newUser.userType) {
        user.userType = "admin"
      }
  
      if (foundUser.dataValues.userId === parseInt(newUser.userId)) {
        await User.update(newUser, { where: { userId } });
        res.status(200).json();
      }
      else {
        res.status(400).send();
      }
    } else if (user.userId === userId) {
      let foundUser = await User.findByPk(userId);
      if (!foundUser) {
        return res.status(404).send();
      }
    
      if (newUser.password) {
        newUser.password = await hashPassword(newUser.password)
      } else {
        newUser.password = foundUser.password;
      }
      
      newUser.userType = "user"
  
      if (foundUser.dataValues.userId === parseInt(newUser.userId)) {
        await User.update(newUser, { where: { userId } });
        res.status(200).json();
      }
      else {
        res.status(400).send();
      }
    } else {
      return res.status(403).send("Not the same user");
    }
  } catch {
    return res.status(500).send("Error modifing user")
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  let user = await verifyUser(req);

  if (!user) {
    return res.status(403).send();
  }

  let userId = parseInt(req.params.id);
  let findUser = await User.findByPk(userId);

  //Is the user making the edit the same user editing themselves? if yes continue
  if (user.userType === "admin") {
    if (findUser) {
      await User.destroy({
        where: { userId: userId },
      });
      res.status(200).send("User deleted");
    } else {
      res.status(404).send("User not found");
    }
  } else if (user.userId === userId) {
    if (findUser) {
      await User.destroy({
        where: { userId: userId },
      });
      res.status(200).send("User deleted");
    } else {
      res.status(404).send("User not found");
    }
  } else {
    res.status(401).send("Unauthorized")
  };
};

export const verifyCurrentUser: RequestHandler = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);

    if (decoded && decoded.userId) {
      const user = await User.findByPk(decoded.userId);

      if (user) {
        return res.json(user);
      }
    }
  }
  return res.status(401).json("Invalid token or user not found");
};