import Credentials from 'next-auth/providers/credentials'
import { compare, hash } from 'bcryptjs'
import { AuthOptions } from 'next-auth'
import prisma from './prisma'


export const authOptions: AuthOptions = {
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter both email and password')
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    select: {
                        id: true,
                        email: true,
                        name : true,
                        isAdmin: true,
                        password: true,
                    }
                })
                
                console.log('User in lib/auth.ts file :', user);

                if (!user) {
                    throw new Error('No account found with this email')
                }

                const isValid = await compare(credentials.password, user.password)

                if (!isValid) {
                    throw new Error('Invalid email or password')
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name || '',
                    isAdmin: user.isAdmin,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.isAdmin = user.isAdmin
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.isAdmin = token.isAdmin as boolean
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
        error: '/error',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
}
