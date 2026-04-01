import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function debug() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hector');
        console.log('Connected to DB');

        const User = mongoose.model('User');
        const Kyc = mongoose.model('Kyc');

        const users = await User.find({}).limit(5);
        console.log('Sample Users:');
        for (const u of users) {
             const k = await Kyc.findOne({ user: u._id });
             console.log(`User: ${u.name}, kycField: ${u.kyc}, hasKycDoc: ${!!k}, profilePic: ${k?.profilePicture}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
