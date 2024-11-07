const allRoles = [
  {
    name: "admin",
    permissions: [
      "create_user",
      "read_user",
      "update_user",
      "delete_user"
    ]
  },
  {
    name: "user",
    permissions: [
        "create_user",
        "update_user",
        "read_user",
        "forgot_password",
        "reset_password"
    ]
  }
]

const roles = allRoles.map((role) => role.name);
const getRoleRights = (roleName: string) =>{
    const findRole = allRoles.find((role) => role.name === roleName)
    return findRole?.permissions || []
}

export {getRoleRights, roles}
