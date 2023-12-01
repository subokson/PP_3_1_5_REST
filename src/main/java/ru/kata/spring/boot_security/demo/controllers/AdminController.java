package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;


@Controller
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService adminService, RoleService roleService) {
        this.userService = adminService;
        this.roleService = roleService;
    }

    @GetMapping("/admin")
    public String getAdminPage(@CurrentSecurityContext(expression = "authentication.principal") User principal,
                               Model model) {
        model.addAttribute("autUser", principal);
        model.addAttribute("newUser", new User());
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("allRoles", roleService.findAll());
        return "admin";
    }

    @PostMapping("/create")
    public String create(@ModelAttribute @Valid User user) {
        userService.addUser(user);
        return "redirect:/admin";
    }

    @PatchMapping("/update")
    public String updateUser(@ModelAttribute @Valid User user) {
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
