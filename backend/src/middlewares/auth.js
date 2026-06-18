export const userLevel = (req, res, next) => {
  const level = req.headers['x-user-level'] || 'basic';
  req.userLevel = ['basic', 'premium', 'admin'].includes(level) ? level : 'basic';
  req.userId = req.headers['x-user-id'] || req.ip;
  next();
};