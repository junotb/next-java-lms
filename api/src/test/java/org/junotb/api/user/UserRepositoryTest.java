package org.junotb.api.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junotb.api.user.enums.UserStatus.*;
import static org.junotb.api.user.enums.UserRole.*;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Pageable;

@DataJpaTest
class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Nested
    @DisplayName("findByRole")
    class FindByRole {
        @Test
        @DisplayName("should return users when they exist for the given role")
        void shouldReturnUsers_whenTheyExistForGivenRole() {
            User newUser = User.create(
                "alice.anderson@example.com",
                "password",
                "Anderson",
                "Alice",
                "alice.anderson@example.com",
                "Ace teacher",
                TEACHER,
                ACTIVE
            );

            userRepository.save(newUser);

            Pageable pageable = Pageable.ofSize(10).withPage(0);
            List<User> founds = userRepository.findByRole(TEACHER, pageable);

            assertThat(founds).isNotEmpty();
            assertThat(founds.get(0).getId()).isEqualTo(newUser.getId());
        }
    }
}
