import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Code share application',
    author: 'Gaurav Chaudhary',
  });
});

export default router;
