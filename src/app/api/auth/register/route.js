import { NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase-admin';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const usersRef = adminDb.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (!snapshot.empty) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === 'admin@pentabrid.com' ? 'ADMIN' : 'STUDENT';

    const newUserRef = usersRef.doc();
    await newUserRef.set({
      name,
      email,
      passwordHash: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, user: { email, name } });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
