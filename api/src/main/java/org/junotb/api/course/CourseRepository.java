package org.junotb.api.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {
    boolean existsByTitle(String title);

    @Query("""
        select c.status as status, count(c) as count
        from Course c
        group by c.status
    """)
    List<StatusCountRow> countByStatus();
}
