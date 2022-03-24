/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stipe";

export default async (req: NextApiRequest, res: NextApiResponse)=>{

    if(req.method === 'POST'){

        //criando um custumer no painel do stripe:
        const session = await getSession({ req });//pegar os dados do usuário logado
        const stripeCustumer = await stripe.customers.create({
            email: session.user.email
        }) 
        
        //criando a sessão do stripe:
        const stripeCheckoutSession = await stripe.checkout.sessions.create({

            customer:stripeCustumer.id,//id do cliente no stripe
            payment_method_types:['card'],
            billing_address_collection:'required',//endereço do cliente
            line_items: [
                {price: 'price_1KMhebEsTYZWYo466auxBA1f',quantity:1}
            ],
            mode:'subscription',
            allow_promotion_codes:true,//para cupons de desconto
            success_url:process.env.SUCCESS_URL,
            cancel_url:process.env.CANCEL_URL
        })

        return res.status(200).json({sessionId: stripeCheckoutSession.id})
        
    } else {
        res.setHeader('Allow', 'POST')//so aceita o metodo post
        res.status(405).end('Method not allowed')
    }
}