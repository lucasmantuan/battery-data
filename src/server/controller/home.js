const home = {
    index(request, response) {
        response.json({ status: 'server is running' });
    },
    favicon(request, response, next) {
        if (request.url === '/favicon.ico') {
            response.writeHead(200, { 'Content-Type': 'image/x-icon' });
            response.end('');
        } else {
            next();
        }
    }
};

module.exports = home;
