package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.model.Role;

import javax.management.relation.RoleNotFoundException;
import java.util.List;

public interface RoleService {
    List<Role> findAll();

    void saveRole(Role role);

    Role getRoleById(int id) throws RoleNotFoundException;
}
