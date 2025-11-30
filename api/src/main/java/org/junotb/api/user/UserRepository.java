package org.junotb.api.user;

import org.junotb.api.user.enums.UserRole;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRole(UserRole role, Pageable pageable);
}
