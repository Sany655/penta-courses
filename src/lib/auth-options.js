import CredentialsProvider from 'next-auth/providers/credentials';
import { adminDb } from './firebase-admin';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const snapshot = await adminDb.collection('users')
          .where('email', '==', credentials.email.trim().toLowerCase())
          .limit(1)
          .get();

        if (snapshot.empty) {
          throw new Error('Invalid credentials');
        }

        const userDoc = snapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() };
        const isCorrectPassword = user.passwordHash
          ? await bcrypt.compare(credentials.password, user.passwordHash)
          : false;

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return user;
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: { signIn: '/auth' }
};
