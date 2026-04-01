import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hector');
        console.log('Connected to DB');

        const User = mongoose.model('User');
        const Kyc = mongoose.model('Kyc');

        const kycs = await Kyc.find({});
        console.log(`Found ${kycs.length} KYC documents`);

        for (const k of kycs) {
            await User.findByIdAndUpdate(k.user, { kyc: k._id });
            console.log(`Linked User ${k.user} to KYC ${k._id}`);
        }

        console.log('Migration completed');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
