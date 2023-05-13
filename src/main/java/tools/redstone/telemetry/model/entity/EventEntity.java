package tools.redstone.telemetry.model.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "event")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type")
public abstract class EventEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;

    @Column(name = "reported_at", nullable = false)
    public Timestamp reportedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sessionId", nullable = false)
    public SessionEntity session;
}