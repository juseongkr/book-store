const unknownEndpoint = (_req: any, res: any): void => {
    res.status(404).send({ error: 'unknownEndpoint' });
};

const errorHandler = (err: any, _req: any, res: any, next: any): void => {
    if (err.name === 'CaseError' && err.kind === 'ObjectId') {
        res.status(400).send({ error: 'malformatted id' });
    } else if (err.name == 'ValidationError') {
        res.status(400).end({ error: err.message });
    } else {
        next(err);
    }
};

const isLoggedIn = (req: any, res: any, next: any): void => {
    const session = req.session;
    if (session.user) {
        next();
    } else {
        res.status(401).send({ error: 'unauthorized access' });
    }
};

const isNotLoggedIn = (req: any, res: any, next: any): void => {
    const session = req.session;
    if (session.user) {
        res.status(401).send({ error: 'unauthorized access' });
    } else {
        next();
    }
};

export default { unknownEndpoint, errorHandler, isLoggedIn, isNotLoggedIn };