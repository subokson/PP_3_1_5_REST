package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.util.Collections;


@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;


    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }


    @GetMapping("/user")
    public String getUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "users";
    }

    @GetMapping("/user/{id}")
    public String getUserById(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", userService.findUserById(id));
        model.addAttribute("roles", userService.findUserById(id).getRoles());
        return "user";
    }

    @GetMapping("/new")
    @Transactional
    public String createNewUser(@ModelAttribute("user") User user, Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.findAll());
        model.addAttribute("role", new Role());
        return "new";
    }

    @PostMapping("/user")
    @Transactional
    public String create(@ModelAttribute("user")@Valid User user, BindingResult bindingResult,
                         @RequestParam("role") String roleName, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("roles", roleService.findAll());
            return "new";
        }
        Role role = new Role();
        role.setName(roleName);

        user.setRoles(Collections.singletonList(role));

        userService.addUser(user);
        return "redirect:/admin/user";
    }

    @GetMapping("/user/{id}/edit")
    @Transactional
    public String edit(Model model, @PathVariable("id") Long id, Model roles) {
        roles.addAttribute("roles", roleService.findAll());
        model.addAttribute("user", userService.findUserById(id));
        return "edit";
    }

    @PostMapping("/user/{id}")
    @Transactional
    public String updateUser(@ModelAttribute("user") @Valid User user, BindingResult bindingResult, @PathVariable("id") Long id, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("roles", roleService.findAll());
            return "edit";
        }

        userService.updateUser(user, id);
        return "redirect:/admin/user";
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin/user";
    }

    @GetMapping
    public String adminHome() {
        return "admin";
    }

}
