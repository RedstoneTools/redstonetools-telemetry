package tools.redstone.telemetry.repository;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import tools.redstone.telemetry.model.dto.MojangAuthenticationRequest;
import tools.redstone.telemetry.model.entity.SessionEntity;

import java.util.Comparator;
import java.util.Objects;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<SessionEntity, Integer> {
    default Optional<SessionEntity> findLatestByMojangAuth(@NotNull MojangAuthenticationRequest mojangAuth) {
        var hashedUuid = mojangAuth.getHashedUuid();

        return findAll().stream()
                .filter(s -> Objects.equals(s.hashedUuid, hashedUuid))
                .max(Comparator.comparing(s -> s.start));
    }
}
