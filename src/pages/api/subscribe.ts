/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stipe";
import { query as q } from "faunadb";
import { fauna } from "../../services/fauna";

type User = {
    ref :{
        id:string
    }

    data :{
        stripe_customer_id: string
    }
}

export default async (req: NextApiRequest, res: NextApiResponse)=>{

    if(req.method === 'POST'){

        const session = await getSession({ req });//pegar os dados do usuário logado

        //Pegando as informações do usuário por email no fauna:

        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        //Verificando se o usuário já existe:
        
        let customerId = user.data.stripe_customer_id // pegar id_customer do usuario

        if(!customerId){

         //cria um custumer no painel do stripe:
         const stripeCustumer = await stripe.customers.create({
            email: session.user.email
          }) 

           //Evitar a duplicação do usuario no stripe e atualizar:

           await fauna.query(
            q.Update(
                q.Ref(q.Collection('users'), user.ref.id),//id do usuario,
                {
                    data : {
                        stripe_customer_id: stripeCustumer.id,
                    }
                }
            )
          )

          customerId = stripeCustumer.id // reatribuindo sempre o valor da chave
        }

    
        //criando a sessão do stripe:
        const stripeCheckoutSession = await stripe.checkout.sessions.create({

            customer: customerId, //id do cliente no stripe
            payment_method_types:['card'],
            billing_address_collection:'required',//endereço do cliente
            line_items: [
                {price: 'price_1KMhebEsTYZWYo466auxBA1f',quantity:1}
            ],
            mode:'subscription',
            allow_promotion_codes:true,//para cupons de desconto
            success_url:process.env.SUCCESS_URL,
            cancel_url: process.env.CANCEL_URL
        })

        return res.status(200).json({sessionId: stripeCheckoutSession.id})
        
    } else {
        res.setHeader('Allow', 'POST')//so aceita o metodo post
        res.status(405).end('Method not allowed')
    }
}