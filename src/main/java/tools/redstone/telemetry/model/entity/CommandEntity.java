package tools.redstone.telemetry.model.entity;

import javax.persistence.*;

@Entity
@DiscriminatorValue("Command")
public class CommandEntity extends EventEntity {
    @Column(name = "command")
    public String command;
}
