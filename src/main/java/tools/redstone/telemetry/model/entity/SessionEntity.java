package tools.redstone.telemetry.model.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "session")
public class SessionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;

    @Column(name = "hashed_uuid", nullable = false)
    public String hashedUuid;

    @Column(name = "start", nullable = false)
    public Timestamp start;

    @Column(name = "end", nullable = false)
    public Timestamp end;
}
