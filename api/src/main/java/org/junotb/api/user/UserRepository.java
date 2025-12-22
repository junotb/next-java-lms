package org.junotb.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query("""
        select u.role as role, count(u) as count
        from User u
        where u.status = 'ACTIVE'
        group by u.role
    """)
    List<RoleCountRow> countByRole();
}
