import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import clientPromise from '@/lib/mongodb'
import { compare } from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client = await clientPromise
        const db = client.db('test')
        const user = await db.collection('suppliers').findOne({ email: credentials?.email })

        if (user && await compare(credentials!.password, user.password)) {
          return { id: user._id.toString(), email: user.email }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
      }
      return session
    },
  },
  pages: {
    signIn: '/supplier/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
