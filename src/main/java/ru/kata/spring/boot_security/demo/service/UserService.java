package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {

    public User findByEmail(String email);

    public List<User> getAllUsers();

    public User findUserById(Long id);

    public User addUser(User user);

    public User updateUser(User user);

    public void deleteUser(Long id);
}
