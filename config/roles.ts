const PERMISSIONS = {
  READ_USER:'read_users',
  UPDATE_USER:'update_user',
  DELETE_USER:'delete_user',
  CREATE_USER:'create_user',
  FORGOT_PASSWORD:'forgot_password',
  RESER_PASSWORD:'reset_password'
}
const allRoles = [
  {
    name: "admin",
    permissions: [
      PERMISSIONS.READ_USER, PERMISSIONS.UPDATE_USER, PERMISSIONS.DELETE_USER, PERMISSIONS.CREATE_USER
    ]
  },
  {
    name: "user",
    permissions: [
        PERMISSIONS.UPDATE_USER, PERMISSIONS.FORGOT_PASSWORD, PERMISSIONS.RESER_PASSWORD
    ]
  }
]

const roles = allRoles.map((role) => role.name);
const getRoleRights = (roleName: string) =>{
    const findRole = allRoles.find((role) => role.name === roleName)
    return findRole?.permissions || []
}

export {getRoleRights, roles, PERMISSIONS}
