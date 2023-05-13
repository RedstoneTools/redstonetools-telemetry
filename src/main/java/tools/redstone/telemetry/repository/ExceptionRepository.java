package tools.redstone.telemetry.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tools.redstone.telemetry.model.entity.ExceptionEntity;
import tools.redstone.telemetry.model.entity.SessionEntity;

public interface ExceptionRepository extends JpaRepository<ExceptionEntity, Integer> {
}

