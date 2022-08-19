import { render, screen } from "@testing-library/react";

import { Header } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return {
        session: undefined,
      };
    },
  };
});

describe("header", () => {
  it("renders correctly", () => {
    render(<Header />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });
});
