package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {

    public User findByName(String name);

    public List<User> getAllUsers();

    public User findUserById(Long id);

    public boolean addUser(User user);

    public void updateUser(User user, Long id);

    public void deleteUser(Long id);

    boolean isUserExists(String username);

}
