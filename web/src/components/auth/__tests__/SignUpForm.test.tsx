"use client";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignUpForm from "../SignUpForm";

describe("SignUpForm", () => {
  it("renders signup form with email, password, name fields", () => {
    const mockOnSubmit = jest.fn();
    render(<SignUpForm error={null} onSubmit={mockOnSubmit} />);

    expect(screen.getByRole("heading", { name: "회원가입" })).toBeInTheDocument();
    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    expect(screen.getByLabelText("이름")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /회원가입/ })).toBeInTheDocument();
  });

  it("displays validation error when email is invalid", async () => {
    const mockOnSubmit = jest.fn();
    render(<SignUpForm error={null} onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText("이메일"), {
      target: { value: "invalid-email", name: "email" },
    });
    fireEvent.input(screen.getByLabelText("비밀번호"), {
      target: { value: "password123", name: "password" },
    });
    fireEvent.input(screen.getByLabelText("이름"), {
      target: { value: "홍길동", name: "name" },
    });
    fireEvent.submit(screen.getByLabelText("이메일").closest("form")!);

    await waitFor(
      () => {
        expect(screen.getByText("유효한 이메일 주소를 입력하세요.")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("displays validation error when password is less than 8 chars", async () => {
    const mockOnSubmit = jest.fn();
    render(<SignUpForm error={null} onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText("이메일"), {
      target: { value: "test@example.com", name: "email" },
    });
    fireEvent.input(screen.getByLabelText("비밀번호"), {
      target: { value: "short", name: "password" },
    });
    fireEvent.input(screen.getByLabelText("이름"), {
      target: { value: "홍길동", name: "name" },
    });
    fireEvent.submit(screen.getByLabelText("이메일").closest("form")!);

    await waitFor(
      () => {
        expect(screen.getByText("비밀번호는 최소 8자 이상이어야 합니다.")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("displays validation error when name is empty", async () => {
    const mockOnSubmit = jest.fn();
    render(<SignUpForm error={null} onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText("이메일"), {
      target: { value: "test@example.com", name: "email" },
    });
    fireEvent.input(screen.getByLabelText("비밀번호"), {
      target: { value: "password123", name: "password" },
    });
    fireEvent.input(screen.getByLabelText("이름"), {
      target: { value: "", name: "name" },
    });
    fireEvent.submit(screen.getByLabelText("이메일").closest("form")!);

    await waitFor(
      () => {
        expect(screen.getByText("이름을 입력하세요.")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with trimmed payload when valid data submitted", async () => {
    const mockOnSubmit = jest.fn();
    render(<SignUpForm error={null} onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText("이메일"), {
      target: { value: "  test@example.com  ", name: "email" },
    });
    fireEvent.input(screen.getByLabelText("비밀번호"), {
      target: { value: "  password123  ", name: "password" },
    });
    fireEvent.input(screen.getByLabelText("이름"), {
      target: { value: "  홍길동  ", name: "name" },
    });
    fireEvent.submit(screen.getByLabelText("이메일").closest("form")!);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        name: "홍길동",
        role: "STUDENT",
        status: "ACTIVE",
      });
    });
  });

  it("displays server error when error prop is provided", () => {
    render(
      <SignUpForm
        error={{ message: "이미 사용 중인 이메일입니다." }}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText("이미 사용 중인 이메일입니다.")).toBeInTheDocument();
  });

  it("displays fallback error message when error has no message", () => {
    render(<SignUpForm error={{}} onSubmit={jest.fn()} />);

    expect(screen.getByText("회원가입 중 오류가 발생했습니다.")).toBeInTheDocument();
  });
});
