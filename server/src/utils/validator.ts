import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain, Result, ValidationError } from 'express-validator';
import { Gender } from '../types';
import { dateRegex } from './config';

export const userValidation = (): ValidationChain[] => {
    return [
        body('username').trim().isEmail().isLength({ min: 6 }),
        body('password').isLength({ min: 8 }),
        body('name').trim().optional(),
    ];
}

export const bookValidation: ValidationChain[] = [
    body('isbn').trim().isLength({ min: 4 }),
    body('title').trim().isLength({ min: 1 }),
    body('published').trim().matches(dateRegex),
    body('author').notEmpty(),
    body('genres').notEmpty(),
    body('rating').optional().isNumeric().isLength({ min: 0, max: 5 }),
    body('description').trim().optional(),
];

export const authorValidation: ValidationChain[] = [
    body('ssn').trim().isLength({ min: 4 }),
    body('name').trim().isLength({ min: 4 }),
    body('birth').trim().matches(dateRegex),
    body('address').notEmpty(),
    body('gender').isIn([Gender.Male, Gender.Female, Gender.Other]),
];

export const validate = (schemas: ValidationChain[]) => {
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