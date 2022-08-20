import { query as q } from "faunadb";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { fauna } from '../../../services/fauna';


export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,

      authorization: {
        params: {
          scope: 'read:user',
        },
      },

    }),
  ],

  callbacks: {

    // verificar se o usuário tem uma conta ative ou não:
    async session ( { session }) {
      
      try{
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )
        
        return {
          ...session,
          activeSubscription : userActiveSubscription
        };
  
      } catch {
          
        return {
          ...session,
          activeSubscription : null
        };
      }
    },

    async signIn({ user, account, profile }) {
      
      const { email } = user;
      console.log(user)
      try{
         await fauna.query(
            //Verificar se o usuário já existe:
           q.If(
             q.Not(
               q.Exists(
                 q.Match(
                   q.Index('user_by_email'),//buscar sempre o usuário pelo index
                   q.Casefold(user.email)//caso digite o email tudo em maiuscula
                 )
               )
             ),
              //Se o usuário não existe criar ele:
             q.Create(
              q.Collection('users'),
              {data: { email }}
            ),
            //Se o usuário já existe buscar as informações:
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
           )
         )

         return true;

      } catch{

        return false;
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET
})
