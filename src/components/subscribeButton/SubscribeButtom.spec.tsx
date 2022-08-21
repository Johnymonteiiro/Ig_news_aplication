import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'jest-mock'
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { SubscribeButtom } from '.';

jest.mock('next-auth/react');
jest.mock('next/router');

describe('SubscribeButtom', () => {

  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: undefined,
      status: "authenticated",
    })

    render(
      <SubscribeButtom />
    )

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirect user to signIn when not authenticated', () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "authenticated",
    })

    render(<SubscribeButtom />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to posts when user already subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce(
      {
        data: {
          user: {
            name: 'John Doe',
            email: 'john.doe@exemple.com'
          },
          activeSubscription: 'fake-active-subscription',
          expires: 'fake-expires'
        }
      } as never
    )

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as never)

    render(<SubscribeButtom />)

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})