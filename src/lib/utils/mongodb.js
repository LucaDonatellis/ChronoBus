import mongoose from 'mongoose';
import { MONGO_URI } from '$env/static/private';
mongoose.connect(MONGO_URI);

export { mongoose };

const officialReportSchema = new mongoose.Schema({
    text: { type: String, required: true },
    expireAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});
export const OfficialReport = mongoose.models.OfficialReport || mongoose.model('OfficialReport', officialReportSchema);
