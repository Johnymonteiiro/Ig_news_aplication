import { GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";
import Prismic from '@prismicio/client';
import { RichText } from "prismic-dom";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


interface ContentTypes {
  content:[],
  text:string,
  type:string
}

interface ResponseTypes  {
  title:string,
  text:string,
  content: ContentTypes[]
    
}

type Post = {
  slug:string,
  title:string,
  excerpt:string,
  updatedAt:string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts ({ posts }: PostsProps) {

  const { data : session} = useSession();
  const [ isActive, setIsActive] = useState(false)

  
  useEffect(()=>{

    if(session?.activeSubscription){
      setIsActive(true);
    } else {
      setIsActive(false)
    }

  },[session])

  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
          <div className={styles.posts}>
            {posts.map(post => (
              <Link  href={ isActive ? `/posts/${post.slug}` : `/posts/preview/${post.slug}`} key={post.slug}>
              <a key={post.slug}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
              </a>
              </Link>
            ))}
          </div>
      </main>
    </>
  );
}
 

export const getStaticProps: GetStaticProps = async () =>{
    const prismic = getPrismicClient()

    const response = await prismic.query<ResponseTypes>([
        Prismic.predicates.at('document.type', 'post')
       ],{
        fetch:['post.title', 'post.content'],
        pageSize: 100,
    })
    
    console.log(response)
    const posts = response.results.map(post => {
      return {
        slug: post.uid,
        title: RichText.asText(post.data.title),
        excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
        updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',{
          day: '2-digit',
          month:'long',
          year: 'numeric'
        })
      };
    });

   console.log(JSON.stringify(response,null,2))

    return {
        props: { posts }
    }
    
}