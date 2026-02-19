"use client";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UserCreateForm from "../UserCreateForm";

describe("UserCreateForm", () => {
  it("renders form with email, password, name, role, status fields", () => {
    const mockOnSubmit = jest.fn();
    render(<UserCreateForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    expect(screen.getByLabelText("이름")).toBeInTheDocument();
    expect(screen.getByLabelText("역할")).toBeInTheDocument();
    expect(screen.getByLabelText("상태")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "등록" })).toBeInTheDocument();
  });

  it("displays validation error when email is invalid", async () => {
    const mockOnSubmit = jest.fn();
    render(<UserCreateForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText("이메일"), {
      target: { value: "invalid", name: "email" },
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
    render(<UserCreateForm onSubmit={mockOnSubmit} />);

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
        expect(screen.getByText("비밀번호는 8자 이상이어야 합니다.")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with payload when valid (default role/status)", async () => {
    const mockOnSubmit = jest.fn();
    render(<UserCreateForm onSubmit={mockOnSubmit} />);

    fireEvent.input(screen.getByLabelText("이메일"), {
      target: { value: "admin@test.com", name: "email" },
    });
    fireEvent.input(screen.getByLabelText("비밀번호"), {
      target: { value: "password123", name: "password" },
    });
    fireEvent.input(screen.getByLabelText("이름"), {
      target: { value: "관리자", name: "name" },
    });
    fireEvent.submit(screen.getByLabelText("이메일").closest("form")!);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
    const callArg = mockOnSubmit.mock.calls[0][0];
    expect(callArg.email).toBe("admin@test.com");
    expect(callArg.password).toBe("password123");
    expect(callArg.name).toBe("관리자");
    expect(callArg.role).toBe("STUDENT");
    expect(callArg.status).toBe("ACTIVE");
  });
});
