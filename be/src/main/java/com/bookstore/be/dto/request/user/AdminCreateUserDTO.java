package com.bookstore.be.dto.request.user;

import com.bookstore.be.util.constant.GenderEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminCreateUserDTO {
    @NotBlank
    private String name;

    @NotBlank
    private String firstName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String passwordConfirm;

    @Min(1)
    private int age;

    private GenderEnum gender;

    private String address;

    private String phoneNumber;


}
