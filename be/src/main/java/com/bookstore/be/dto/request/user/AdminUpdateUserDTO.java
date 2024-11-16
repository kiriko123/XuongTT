package com.bookstore.be.dto.request.user;

import com.bookstore.be.util.constant.GenderEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminUpdateUserDTO {

    @NotNull
    @Min(1)
    private long id;

    @NotBlank
    private String name;

    @NotBlank
    private String firstName;

    @NotBlank
    @Email
    private String email;

    @Min(1)
    private int age;

    private GenderEnum gender;

    private String address;

    private String phoneNumber;

    private boolean enabled;
}
