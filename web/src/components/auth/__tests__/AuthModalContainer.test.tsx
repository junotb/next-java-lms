"use client";

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import AuthModalContainer from "../AuthModalContainer";
import { useAuthModalStore } from "@/stores/useAuthModalStore";

const mockReplace = jest.fn();

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: { email: jest.fn() },
    signUp: { email: jest.fn() },
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: mockReplace,
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("AuthModalContainer", () => {
  const getAuthClient = () => require("@/lib/auth-client").authClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReplace.mockClear();
    useAuthModalStore.setState({ modalType: null });
  });

  it("renders nothing when modal is closed", () => {
    render(<AuthModalContainer />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls authClient.signIn.email when login form submitted", async () => {
    getAuthClient().signIn.email.mockResolvedValue({
      data: { user: { id: "1", name: "Test", role: "STUDENT" } },
      error: null,
    });

    render(<AuthModalContainer />);

    act(() => {
      useAuthModalStore.getState().openModal("signin");
    });

    await waitFor(() => {
      expect(screen.getByLabelText("아이디")).toBeInTheDocument();
    });

    fireEvent.input(screen.getByLabelText("아이디"), {
      target: { value: "test@example.com", name: "email" },
    });
    fireEvent.input(screen.getByLabelText("비밀번호"), {
      target: { value: "password123", name: "password" },
    });
    fireEvent.submit(screen.getByLabelText("아이디").closest("form")!);

    await waitFor(() => {
      expect(getAuthClient().signIn.email).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows error when signIn returns error", async () => {
    getAuthClient().signIn.email.mockResolvedValue({
      data: null,
      error: { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
    });

    render(<AuthModalContainer />);

    act(() => {
      useAuthModalStore.getState().openModal("signin");
    });

    await waitFor(() => {
      expect(screen.getByLabelText("아이디")).toBeInTheDocument();
    });

    fireEvent.input(screen.getByLabelText("아이디"), {
      target: { value: "wrong@example.com", name: "email" },
    });
    fireEvent.input(screen.getByLabelText("비밀번호"), {
      target: { value: "wrongpassword", name: "password" },
    });
    fireEvent.submit(screen.getByLabelText("아이디").closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("이메일 또는 비밀번호가 올바르지 않습니다.")).toBeInTheDocument();
    });
  });

  it("switches between signin and signup modal", async () => {
    render(<AuthModalContainer />);

    act(() => {
      useAuthModalStore.getState().openModal("signin");
    });

    await waitFor(() => {
      expect(screen.getByLabelText("아이디")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("계정이 없으신가요? 회원가입"));

    await waitFor(() => {
      expect(screen.getByLabelText("이름")).toBeInTheDocument();
    });
  });
});
