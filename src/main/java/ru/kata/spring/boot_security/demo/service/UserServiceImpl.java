package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;

        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public User findByName(String name) {
        return userRepository.findUserByUsername(name).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User findUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public boolean addUser(User user) {
        if (userRepository.findUserByUsername(user.getUsername()).isPresent()) {
            return false;
        } else {
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            userRepository.save(user);
        }
        return true;
    }

    @Override
    public void updateUser(User user, Long id) {
        User userUpdate = findUserById(id);
        if (userUpdate == null) {
            throw new UsernameNotFoundException("Ошибка выполнения");
        }

        userUpdate.setUsername(user.getUsername());
        userUpdate.setSurname(user.getSurname());
        if (!userUpdate.getPassword().equals(user.getPassword())) {
            userUpdate.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        }
        userUpdate.setRoles(user.getRoles());
        userRepository.flush();
    }

    @Override
    public void deleteUser(Long id) {
        if (userRepository.findById(id).isPresent()) {
            userRepository.deleteById(id);
        } else {
            throw new UsernameNotFoundException("Пользователь не найден");
        }
    }

    @Override
    public boolean isUserExists(String username) {
        return userRepository.findUserByUsername(username).isPresent();
    }
}
