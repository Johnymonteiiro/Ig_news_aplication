import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { SubscribeButtom } from '../components/subscribeButton';
import { stripe } from '../services/stipe';
import styles from './home.module.scss';


interface HomeProps {
  product:{
     priceId:string,
     amount:string
  }
}

export default function Home({product} : HomeProps) {
  return (
    <>
    <Head>
      <title>Home | ig.news</title>
    </Head>

    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👏 Hey, welcome</span>
        <h1>News about the <span>React</span> world</h1>
        <p>Get access to all the publications<br/>
           <span>for {product.amount} month</span>
        </p>
        <SubscribeButtom />
      </section>

      <Image src='/images/avatar.svg' height={500} width={500} alt='Girl coding' />
    </main>
     
    </>
  )
}

export const getStaticProps : GetStaticProps = async () =>{

  const price = await stripe.prices.retrieve('price_1KMhebEsTYZWYo466auxBA1f', {
    expand: ['product']
  })

  const product = {
      priceId: price.id,
      amount: new Intl.NumberFormat('en-Us',{
        style:'currency',
        currency:'USD',
      }).format(price.unit_amount / 100)
  }
  
  return{
    props :{
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
 