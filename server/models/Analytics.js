const mongoose = require('mongoose');

const analyticsSchema = mongoose.Schema({
    totalVisitors: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    contactRequests: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
