package org.junotb.api.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "\"user\"")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class User {
    @Id
    @Column(name = "\"id\"")
    private String id;

    @Column(name = "\"name\"", nullable = false)
    private String name;

    @Column(name = "\"email\"", nullable = false)
    private String email;

    @Column(name = "\"emailVerified\"", nullable = false)
    private Boolean emailVerified;

    @Column(name = "\"image\"", nullable = false)
    private String image;

    @Column(name = "\"createdAt\"", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "\"updatedAt\"", nullable = false)
    private OffsetDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"role\"", nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"status\"", nullable = false)
    private UserStatus status;

    public static User create(
        String name,
        String email,
        Boolean emailVerified,
        String image,
        UserRole role,
        UserStatus status
    ) {
        return User.builder()
            .name(name)
            .email(email)
            .emailVerified(emailVerified)
            .image(image)
            .role(role)
            .status(status)
            .build();
    }

    @PrePersist
    void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}
