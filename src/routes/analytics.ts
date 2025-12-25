import {Router} from 'express';
import {getSummaryAnalytics} from '../controllers/analyticsController';

const analyticsRouter = Router();

analyticsRouter.get('/summary', getSummaryAnalytics);

export default analyticsRouter;