import { type AuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getOrCreateUser } from '@/lib/access';

const providers = [];

if (process.env.NODE_ENV === 'production') {
  providers.push(
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
      authorization: {
        params: {
          scope: 'openid profile email User.Read',
        },
      },
    })
  );
} else {
  providers.push(
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'dev' },
      },
      async authorize(credentials) {
        if (credentials?.username) {
          const user = await getOrCreateUser(credentials.username);
          return { id: user, name: user };
        }
        return null;
      },
    })
  );
}

export const authOptions: AuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'azure-ad' && profile?.email) {
        await getOrCreateUser(profile.email, profile.email);
      }
      if (user) {
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
      }
      return session;
    },
  },
};
