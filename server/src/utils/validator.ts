import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain, Result, ValidationError } from 'express-validator';
import { Gender } from '../types';

export const userValidation: Array<ValidationChain> = [
    body('username').isEmail().isLength({ min: 6 }),
    body('password').isLength({ min: 8 }),
    body('name').trim().optional(),
];

export const bookValidation: Array<ValidationChain> = [
    body('isbn').trim().isLength({ min: 4 }),
    body('title').trim().isLength({ min: 1 }),
    body('published').isISO8601(),
    body('author').notEmpty(),
    body('genres').notEmpty(),
    body('rating').optional().isNumeric().isLength({ min: 0, max: 5 }),
    body('description').trim().optional(),
];

export const authorValidation: Array<ValidationChain> = [
    body('ssn').trim().isLength({ min: 4 }),
    body('name').trim().isLength({ min: 4 }),
    body('birth').isISO8601(),
    body('address').notEmpty(),
    body('gender').isIn([Gender.Male, Gender.Female, Gender.Other]),
];

export const validate = (schemas: Array<ValidationChain>) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void | Response<NextFunction | Response>> => {
        await Promise.all(schemas.map(s => s.run(req)));
        const result: Result<ValidationError> = validationResult(req);
        if (result.isEmpty()) {
            return next();
        }

        const errors: Array<ValidationError> = result.array();
        return res.send(errors);
    };
}