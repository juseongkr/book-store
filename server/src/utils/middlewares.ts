const unknownEndpoint = (_req: any, res: any): void => {
    res.status(404).send({ error: 'unknownEndpoint' });
};

const errorHandler = (err: any, _req: any, res: any, next: any) => {
    if (err.name === 'CaseError' && err.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (err.name == 'ValidationError') {
        return res.status(400).end({ error: err.message });
    }
    next(err);
}

export default { unknownEndpoint, errorHandler };