package com.person.b2b.exception;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String email) {
        super("Un compte existe déjà avec l'email : " + email);
    }
}
