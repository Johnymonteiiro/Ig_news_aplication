import { render, screen } from "@testing-library/react"

import Home, { getStaticProps } from "../pages";
import { stripe } from "../services/stipe";

jest.mock('next/router');
jest.mock('next-auth/react', () => {
  return {
    useSession: () => [null,false]
  }
});

jest.mock('../services/stipe');

describe("Home", ()=>{

  it('renders correctly', ()=>{
    render( <Home product={{priceId: "fake-price-id", amount:"R$10,00"}}/>)

    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument()
  })

  it('loads initial data',async () => {
    const retrieveStripePriceMocked = jest.mocked(stripe.prices.retrieve)

    retrieveStripePriceMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})
