package com.email.emailwritersb.Service;


import com.email.emailwritersb.DTO.EmailRequest;
import org.springframework.stereotype.Service;

@Service
public class EmailGeneratorService {
    public String generateEmailReply(EmailRequest emailRequest) {
        //Build the prompt

        String prompt = buildPropmt(emailRequest);
        //Craft a request
        //Request and get response
        //return response

    }

    private String buildPropmt(EmailRequest emailRequest) {

        StringBuilder prompt=new StringBuilder();
        prompt.append(" Generate a professional email reply for the following email content. Please dont generate a subject line");
        if(emailRequest.getTone()!= null && !emailRequest.getTone().isEmpty()){
            prompt.append(" Use a ").append(emailRequest.getTone()).append(" tone.");
        }
        prompt.append("\nOriginal email: \n").append(emailRequest.getEmailContent());

        return prompt.toString();
    }
}
