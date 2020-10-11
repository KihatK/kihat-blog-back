import { Request, Response, NextFunction } from 'express';

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    res.status(401).send('로그인이 필요합니다.');
  }
}

const isAdminLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.admin) {
    //req.user.admin 타입 에러 안뜨려면 따로 설정을 해줘야함
    next();
  }
  else {
    res.status(401).send('권한이 없습니다.');
  }
}

const isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    next();
  }
  else {
    res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
  }
}

export { isLoggedIn, isAdminLoggedIn, isNotLoggedIn };