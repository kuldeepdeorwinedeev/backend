import {
  addUser,
  deleteUser,
  editUser,
  getAllUsers,
  getUserById,
} from "../../controllers/admin/userManage.js";
import auth from "../../middlewares/auth.js";
export default [
  {
    method: "GET",
    url: "users",
    handler: getAllUsers,
    preHandler: (auth.checkAdmin, auth.requireAuth),
  },
  {
    method: "GET",
    url: "users/:id",
    handler: getUserById,
    preHandler: (auth.checkAdmin, auth.requireAuth),
  },
  {
    method: "POST",
    url: "users/add",
    handler: addUser,
    preHandler: (auth.checkAdmin, auth.requireAuth),
  },
  {
    method: "POST",
    url: "users/edit/:id",
    handler: editUser,
    preHandler: (auth.checkAdmin, auth.requireAuth),
  },
  {
    method: "DELETE",
    url: "users/delete/:id",
    handler: deleteUser,
    preHandler: (auth.checkAdmin, auth.requireAuth),
  },
];
