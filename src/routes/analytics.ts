import {Router} from 'express';
import {getSummaryAnalytics, getTimeSeries, getTopPages, getRecentEvents} from '../controllers/analyticsController';


const analyticsRouter = Router();

analyticsRouter.get('/summary', getSummaryAnalytics);
analyticsRouter.get('/timeseries', getTimeSeries);
analyticsRouter.get("/top-pages", getTopPages);
analyticsRouter.get("/recent", getRecentEvents);

export default analyticsRouter;