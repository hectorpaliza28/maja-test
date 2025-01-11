import { body } from "express-validator";

export const registerValidation = [
    body("nombre").isString(),
    body("apellido").isString(),
    body("email").isEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6,  }).withMessage("La contraseña debe tener al menos 6 caracteres")
                    .matches(/[0-9]/).withMessage("La contraseña debe contener al menos un número")
                    .matches(/[A-Z]/).withMessage("La contraseña debe contener al menos una letra mayúscula")
                    .matches(/[a-z]/).withMessage("La contraseña debe contener al menos una letra minúscula")
                    .matches(/\W|_/).withMessage("La contraseña debe contener al menos un caracter especial")
];