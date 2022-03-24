import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJS } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId } : SubscribeButtonProps) {

  const { data: session } = useSession()

 async function handlesubscribe () {
      
    if(!session){
      signIn('github'); 
      return;
    }

    //criação da checkout session:
    try{
       const response = await api.post('/subscribe')
       const { sessionId } = response.data;

       const stripe = await getStripeJS();
       await stripe.redirectToCheckout({ sessionId: sessionId });

    }catch(err){
      alert(err.message)
    }
  }

  return (
     <button 
     type="button" 
     className={styles.subscribeButton}
     onClick= {handlesubscribe}
     >
       Subscribe now
     </button>
  );
}



