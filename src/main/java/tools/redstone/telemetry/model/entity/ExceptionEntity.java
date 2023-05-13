package tools.redstone.telemetry.model.entity;

import javax.persistence.*;

@Entity
@DiscriminatorValue("Exception")
public class ExceptionEntity extends EventEntity {
    @Column(name = "stack_trace")
    public String stackTrace;

    @Column(name = "is_fatal")
    public Boolean isFatal;
}
