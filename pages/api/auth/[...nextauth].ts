import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import clientPromise from '@/lib/mongodb'
import { compare } from 'bcryptjs'
import { JWT } from 'next-auth/jwt'
import { MongoClient } from 'mongodb'

interface ExtendedUser {
  id: string
  email: string
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client: MongoClient = await clientPromise
        const db = client.db('test')
        const user = await db.collection('suppliers').findOne({ email: credentials?.email })

        if (user && credentials?.password) {
          const isValid = await compare(credentials.password, user.password)
          if (isValid) {
            return { id: user._id.toString(), email: user.email } as ExtendedUser
          }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: ExtendedUser }): Promise<JWT> {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
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


