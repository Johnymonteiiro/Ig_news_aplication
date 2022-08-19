import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";

import { SignInbuttom } from ".";

jest.mock("next-auth/react");

describe("SignInbuttom", () => {
  it("renders correctly when user is not Authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValue({
      data: undefined,
      status: "authenticated",
    });

    render(<SignInbuttom />);

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  it("renders correctly when user is Authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "john@gmail.com" },
        expires: "fake-expires",
      },
      status: "authenticated",
    });

    render(<SignInbuttom />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
