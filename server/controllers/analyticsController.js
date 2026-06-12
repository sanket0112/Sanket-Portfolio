const Analytics = require('../models/Analytics');

// Helper to get or create the single analytics document
const getAnalyticsDoc = async () => {
    let analytics = await Analytics.findOne();
    if (!analytics) {
        analytics = await Analytics.create({});
    }
    return analytics;
};

// @desc    Track a page view / visitor
// @route   POST /api/analytics/track
// @access  Public
const trackVisit = async (req, res, next) => {
    try {
        const { isNewVisitor } = req.body;
        const analytics = await getAnalyticsDoc();

        analytics.pageViews += 1;
        if (isNewVisitor) {
            analytics.totalVisitors += 1;
        }

        await analytics.save();
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

// @desc    Get analytics stats
// @route   GET /api/analytics
// @access  Private (Admin)
const getStats = async (req, res, next) => {
    try {
        const analytics = await getAnalyticsDoc();
        res.status(200).json(analytics);
    } catch (error) {
        next(error);
    }
};

module.exports = { trackVisit, getStats };
