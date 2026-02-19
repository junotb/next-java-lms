"use client";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignInForm from "../SignInForm";

describe("SignInForm", () => {
  it("renders login form with email and password fields", () => {
    const mockOnSubmit = jest.fn();
    render(<SignInForm error={null} onSubmit={mockOnSubmit} />);

    expect(screen.getByRole("heading", { name: "로그인" })).toBeInTheDocument();
    expect(screen.getByLabelText("아이디")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /로그인/ })).toBeInTheDocument();
  });

  it("displays validation error when email is invalid", async () => {
    const mockOnSubmit = jest.fn();
    render(<SignInForm error={null} onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText("아이디"), {
      target: { value: "invalid-email", name: "email" },
    });
    fireEvent.input(screen.getByLabelText("비밀번호"), {
      target: { value: "password123", name: "password" },
    });
    fireEvent.submit(screen.getByLabelText("아이디").closest("form")!);

    await waitFor(
      () => {
        expect(screen.getByText("유효한 이메일 주소를 입력하세요.")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("displays validation error when password is empty", async () => {
    const mockOnSubmit = jest.fn();
    render(<SignInForm error={null} onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText("아이디"), {
      target: { value: "test@example.com", name: "email" },
    });
    fireEvent.submit(screen.getByLabelText("아이디").closest("form")!);

    await waitFor(
      () => {
        expect(screen.getByText("비밀번호를 입력하세요.")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with trimmed payload when valid data submitted", async () => {
    const mockOnSubmit = jest.fn();
    render(<SignInForm error={null} onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText("아이디"), {
      target: { value: "  test@example.com  ", name: "email" },
    });
    fireEvent.input(screen.getByLabelText("비밀번호"), {
      target: { value: "  password123  ", name: "password" },
    });
    fireEvent.submit(screen.getByLabelText("아이디").closest("form")!);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("displays server error when error prop is provided", () => {
    render(
      <SignInForm
        error={{ message: "이메일 또는 비밀번호가 올바르지 않습니다." }}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText("이메일 또는 비밀번호가 올바르지 않습니다.")).toBeInTheDocument();
  });
});
