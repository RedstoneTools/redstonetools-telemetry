package tools.redstone.telemetry.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tools.redstone.telemetry.model.entity.CommandEntity;
import tools.redstone.telemetry.model.entity.ExceptionEntity;

public interface CommandRepository extends JpaRepository<CommandEntity, Integer> {
}

