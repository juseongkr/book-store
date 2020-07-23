"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unknownEndpoint = (_req, res) => {
    res.status(404).send({ error: 'unknownEndpoint' });
};
const errorHandler = (err, _req, res, next) => {
    if (err.name === 'CaseError' && err.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' });
    }
    else if (err.name == 'ValidationError') {
        return res.status(400).end({ error: err.message });
    }
    next(err);
};
exports.default = { unknownEndpoint, errorHandler };
