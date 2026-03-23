package com.university.sms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DataIntegrityException extends RuntimeException {

    public DataIntegrityException(String message) {
        super(message);
    }

    public DataIntegrityException(String entity, String operation) {
        super(String.format("Data integrity violation while performing %s on %s", operation, entity));
    }
}