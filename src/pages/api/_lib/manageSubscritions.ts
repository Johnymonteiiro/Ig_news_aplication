import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stipe";

//Essa função vai salvar as informações no banco de dados:
export async function saveSubscription (
    subscriptionId:string,
    custumerId:string,
    createActions = false //será true caso o evento seja 'checkout.session.completed' e cria uma nova subscrição
    
    ){

        //Pegando a referença do usuário no Fauna:
    const useRef = await fauna.query(
        q.Select(
            "ref",//Vai selecionar apenas a ref do usuário e pegar o id 
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),//criar no Fauna
                    custumerId
                )
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)//Pegando todos os dados da subscrição do usuário
    
    const subscriptionData = {// os dados mais relevantes
        id:subscription.id,
        userId: useRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,//porque vai comprar apenas um produto
    }

    if(createActions){

       //Criando e Salvando os dados da subscrição do usuário no FaunaDB:
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),//criar no Fauna
                { data: subscriptionData }
            )
        )
        
    } else {

        //Atualiza os dados da subscrição do usuário no FaunaDB:
       await fauna.query(
           q.Replace(
            q.Select(
                "ref",
                q.Get(
                    q.Match(
                        q.Index('subscription_by_id'),//criar no Fauna
                        subscriptionId
                    )
                )
            ),
            { data: subscriptionData }//os dados que serão atualizados
           )
       )
    }
}