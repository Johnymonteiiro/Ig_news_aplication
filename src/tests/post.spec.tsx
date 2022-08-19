import { render, screen } from "@testing-library/react"
import { getSession } from "next-auth/react";

import Post, { getServerSideProps } from "../pages/posts/[slug]";
import { getPrismicClient } from "../services/prismic";

const posts = {
  slug:'my-new-post',
  title:'My new Post',
  content:'<p>Post content</p>',
  updatedAt:'10 de abril'
}

jest.mock('next-auth/react');

jest.mock('../services/prismic');

describe("post", ()=>{

  it('renders correctly', ()=>{
    render(<Post post={posts} />)

    expect(screen.getByText("My new Post")).toBeInTheDocument()
    expect(screen.getByText("Post content")).toBeInTheDocument()
  })

  it('redirects user if no subscription is found',async () => {
    
    const getSessionMocked = jest.mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)
    
    const response = await getServerSideProps({
      params:{
        slug:'my-new-post',
      },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )
  })

  it('loads initial data', async () =>{
    const getSessionMocked = jest.mocked(getSession)
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription:'fake-active-subscription'
    } as any)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data :{
          title: [{type:'heading', text:'My new Post'}],
          content: [{type:'paragraph', text:'Post content'}],
        },
        last_publication_date: '04-01-2021',
      })
    } as any)

    const response = await getServerSideProps({
      params:{
        slug:'my-new-post',
      },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: 
            {
              slug:'my-new-post',
              title:'My new Post',
              content:'<p>Post content</p>',
              updatedAt:'01 de abril de 2021'
            }
        } 
      })
    )
  })
})
