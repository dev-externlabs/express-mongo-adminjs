import {z } from "zod"

const objectId = z.string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value), {
  message: '"{value}" must be a valid mongo id',
});

const password = z.string().min(8,"password must be 8 characters long")
.refine((value) => /\d/.test(value) && /[a-zA-Z]/.test(value), {
  message: 'password must contain at least 1 letter and 1 number',
});

export {objectId, password}
