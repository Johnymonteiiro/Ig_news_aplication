import Stripe from "stripe";

// Stipe é um SDK para fazer as requisições da api do stripe, para não precisar fazer todas as requisições http

export const stripe = new Stripe(
    process.env.STRIPE_API_KEY,
        {
        apiVersion:'2020-08-27',
        appInfo:{
            name:'Ignews',
            version: '0.1.0'
        }
    }
) 