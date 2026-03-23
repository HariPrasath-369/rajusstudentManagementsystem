package com.university.sms.validator;

import com.university.sms.repository.UserRepository;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = UniqueEmailValidator.EmailValidator.class)
public @interface UniqueEmailValidator {
    String message() default "Email address is already in use";
    Class<?>[] groups() default {};
    Class<?>[] payload() default {};

    @Component
    class EmailValidator implements ConstraintValidator<UniqueEmailValidator, String> {

        @Autowired
        private UserRepository userRepository;

        @Override
        public void initialize(UniqueEmailValidator constraintAnnotation) {
        }

        @Override
        public boolean isValid(String email, ConstraintValidatorContext context) {
            if (email == null || email.isEmpty()) {
                return true;
            }
            return !userRepository.existsByEmail(email);
        }
    }
}