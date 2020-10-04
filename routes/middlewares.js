const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(401).send('로그인이 필요합니다.');
    }
}

const isAdminLoggedIn = (req, res, next) => {
    if (req.user && req.user.admin) {
        next();
    }
    else {
        res.status(401).send('권한이 없습니다.');
    }
}

const isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    }
    else {
        res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
    }
}

module.exports = {
    isLoggedIn, isAdminLoggedIn, isNotLoggedIn
};