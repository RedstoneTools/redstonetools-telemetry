package tools.redstone.telemetry.model.dto;

import tools.redstone.telemetry.util.HashUtils;

public class MojangAuthenticationRequest {
    public String serverId;
    public String selectedProfile;
    public String accessToken;

    public String getHashedUuid() {
        return HashUtils.sha256(serverId);
    }
}
