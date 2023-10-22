const app = {
    notFound(request, response, next) {
        const err = new Error('not found');
        // @ts-ignore
        err.status = 404;
        next(err);
    },
    handleError(err, request, response, next) {
        if (err.status !== 404) console.log(err.stack);
        response.status(err.status || 500);
        response.json({ error: err.message });
    }
};

module.exports = app;
