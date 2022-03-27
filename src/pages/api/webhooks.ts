/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stipe";
import { saveSubscription } from "./_lib/manageSubscritions";


//Transformando o formato do streaming em algo legivel:

async function buffer (readable: Readable){
    const chunks = [];

    for await (const chunk of readable){//cada vez que recebe uma requisição armzena ele na variável Chunks.
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        )
    };

    return Buffer.concat(chunks)
}

export const config = {//caso a requisição vem como uma stream, assim fica desabilitado o bodyParser
    api:{
        bodyParser : false
    }
}

//quais eventos a gente quer para a nossa App:
const relevantEvents = new Set([ 
    'checkout.session.completed',//caso o usuário realizar sua inscrição
    'customer.subscription.updated',//caso o usuário atualizar sua inscrição
    'customer.subscription.deleted'//caso o usuário cancela sua inscrição
])

export default async (req:NextApiRequest, res:NextApiResponse) => {
    
    if(req.method === 'POST'){

     const buf = await buffer(req)// Tem todos os dados da requisição
     const secret = req.headers['stripe-signature']//secret key enviada pelo stripe

     let event: Stripe.Event;//eventos do webhook

     try{
         event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOKS_SECRET);
         //se as veriaveis de ambiente baterem e criar os eventos, está OK.
     } catch (err){
        return res.status(400).send(`webhook error ${err.message}`);
     }

     const { type } = event;//Tendo acesso a toddos eventos

     if(relevantEvents.has(type)){
       
        try{
            switch(type){
                //Ouvindo cada um dos eventos:
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':

                 const subscription = event.data.object as Stripe.Subscription;//Pegando o evento específico

                 await saveSubscription(//passando os parametros para a função:
                     subscription.id,
                     subscription.customer.toString(),
                      false
                     )

                   break;

                case 'checkout.session.completed':
            
                const checkoutSession = event.data.object as Stripe.Checkout.Session;//Pegando o evento específico

                await saveSubscription (//passando os parametros para a função:
                //Covertendo osparm como string:
                  checkoutSession.subscription.toString(),
                  checkoutSession.customer.toString(),
                  true
                )
                    break;
                    default:
                        throw new Error ('Unhandled event.')
            }

        } catch(err){
            return res.json({error: 'webhook handle failed.'})
        }
     }

     res.json({received: true})

    } else {
        res.setHeader('Allow', 'POST')//so aceita o metodo post
        res.status(405).end('Method not allowed')
    }
    

}