import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "WordPress",
      credentials: {
        username: { label: "Usuario o Correo", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/jwt-auth/v1/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });
          
          const user = await res.json();
          
          if (res.ok && user.token) {
            return {
              id: user.user_email || user.user_display_name || "wp_user",
              name: user.user_display_name,
              email: user.user_email,
              token: user.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Sincronizar usuario de Google con WooCommerce
        try {
          const email = user.email;
          const auth = Buffer.from(`${process.env.WOOCOMMERCE_KEY}:${process.env.WOOCOMMERCE_SECRET}`).toString('base64');
          
          // Verificar si existe
          const checkRes = await fetch(`${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/customers?email=${email}`, {
            headers: { 'Authorization': `Basic ${auth}` }
          });
          
          const existingCustomers = await checkRes.json();
          
          // Si no existe, lo creamos
          if (existingCustomers.length === 0) {
            const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
            await fetch(`${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/customers`, {
              method: 'POST',
              headers: { 
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: email,
                first_name: user.name?.split(' ')[0] || "",
                last_name: user.name?.split(' ').slice(1).join(' ') || "",
                username: email?.split('@')[0],
                password: randomPassword
              })
            });
          }
        } catch (error) {
          console.error("Error syncing Google user with WC:", error);
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        if (account?.provider === "credentials") {
          token.jwt = user.token;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token.jwt) {
        session.jwt = token.jwt;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
