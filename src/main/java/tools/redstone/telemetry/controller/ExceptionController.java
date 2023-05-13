package tools.redstone.telemetry.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import tools.redstone.telemetry.model.dto.ExceptionRequest;
import tools.redstone.telemetry.model.entity.ExceptionEntity;
import tools.redstone.telemetry.model.entity.SessionEntity;
import tools.redstone.telemetry.repository.ExceptionRepository;

import java.sql.Timestamp;
import java.time.Instant;

@Controller
public class ExceptionController {
    private final ExceptionRepository exceptionRepository;

    @Autowired
    public ExceptionController(ExceptionRepository exceptionRepository) {
        this.exceptionRepository = exceptionRepository;
    }

    @PostMapping("/exception")
    public ResponseEntity<Void> postException(@RequestBody ExceptionRequest exceptionRequest, HttpSession httpSession) {
        ExceptionEntity exceptionEntity = new ExceptionEntity();
        exceptionEntity.reportedAt = Timestamp.from(Instant.now());
        exceptionEntity.stackTrace = exceptionRequest.stackTrace;
        exceptionEntity.isFatal = exceptionRequest.isFatal;
        exceptionEntity.session = (SessionEntity) httpSession.getAttribute("session");

        exceptionRepository.save(exceptionEntity);

        return ResponseEntity.noContent().build();
    }
}
