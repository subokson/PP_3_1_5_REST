package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.model.Role;

import javax.management.relation.RoleNotFoundException;
import java.util.Set;

public interface RoleService {
    public Set<Role> findAll();

    void saveRole(Role role);

    Role getRoleById(int id) throws RoleNotFoundException;
}
