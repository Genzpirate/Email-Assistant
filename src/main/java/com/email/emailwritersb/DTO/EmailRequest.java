package com.email.emailwritersb.DTO;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
}
