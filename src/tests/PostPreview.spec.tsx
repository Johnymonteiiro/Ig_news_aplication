import { render, screen } from "@testing-library/react"
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Post, { getStaticProps } from "../pages/posts/preview/[slug]";
import { getPrismicClient } from "../services/prismic";

const posts = {
  slug:'my-new-post',
  title:'My new Post',
  content:'<p>Post content</p>',
  updatedAt:'10 de abril'
}

jest.mock('next-auth/react');
jest.mock('next/router');
jest.mock('../services/prismic');

describe("PostPreview", ()=>{

  it('renders correctly', ()=>{

    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data:null,
      status:'authenticated'
    })

    render(<Post post={posts} />)

    expect(screen.getByText("My new Post")).toBeInTheDocument()
    expect(screen.getByText("Post content")).toBeInTheDocument()
    expect(screen.getByText("Wanna continue Reading?")).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed',async () => {
     
    const useSessionMocked = jest.mocked(useSession)
    const useRouterMocked = jest.mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data:{ activeSubscription: 'fake-active-subscrition', expires: 'fake-expires'},
      status:'authenticated',
    })

    useRouterMocked.mockReturnValueOnce({
       push: pushMock,
    } as any)

    render(<Post post={posts} />)
  
    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')

  })

  it('loads initial data', async () =>{
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data :{
          title: [{type:'heading', text:'My new Post'}],
          content: [{type:'paragraph', text:'Post content'}],
        },
        last_publication_date: '04-01-2021',
      })
    } as any)

    const response = await getStaticProps({ params: { slug:'my-new-post'}})

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
