package pro.com.example.backend.service;

import pro.com.example.backend.model.User;

public interface UserService {
    User saveUser(User user);
    User findByEmail(String email);
}
