import Link from 'next/link';

// scripts/seed.ts
import mongoose from 'mongoose';
import User, { UserRole } from '../models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apex-quiz';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

async function seed() {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const adminEmail = 'admin@apex.com';
        const adminPassword = 'password123';

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Super Admin already exists.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const adminUser = await User.create({
            name: 'Super Admin',
            email: adminEmail,
            password: hashedPassword,
            role: UserRole.SUPER_ADMIN,
        });

        console.log('Super Admin created successfully');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
