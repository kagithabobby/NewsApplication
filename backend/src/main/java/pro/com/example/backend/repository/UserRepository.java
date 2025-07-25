package pro.com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pro.com.example.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
