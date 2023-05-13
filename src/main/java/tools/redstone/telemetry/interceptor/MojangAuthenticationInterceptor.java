package tools.redstone.telemetry.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import tools.redstone.telemetry.model.dto.MojangAuthenticationRequest;
import tools.redstone.telemetry.repository.SessionRepository;
import tools.redstone.telemetry.util.JsonUtils;

import java.io.IOException;

@Component
public class MojangAuthenticationInterceptor implements HandlerInterceptor {
    // TODO: Most of this code is wrong, the session should be fetched using a JWT, the middleware should
    //  handle that, the mojang auth verification code should be moved to the /session controllers.
    //  Although it might not be a bad idea to use middleware for the /session controllers since they both
    //  need to be authenticated using a mojang auth.

    private static final String AUTH_SERVER_URL = "https://sessionserver.mojang.com/session/minecraft/join";

    private final SessionRepository sessionRepository;
    private final OkHttpClient client = new OkHttpClient();

    public MojangAuthenticationInterceptor(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    public boolean preHandle(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull Object handler) throws IOException {
        // Get MojangAuthenticationRequest from request body
        MojangAuthenticationRequest mojangAuth = ...;

        if (!isValidAuth(mojangAuth)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        var session = sessionRepository
                .findLatestByMojangAuth(mojangAuth)
                .orElse(null);

        if (session == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        var httpSession = request.getSession(true);
        httpSession.setAttribute("session", session);

        return true;
    }

    public boolean isValidAuth(MojangAuthenticationRequest mojangAuth) {
        var request = new Request.Builder()
                .url(AUTH_SERVER_URL)
                .post(RequestBody.create(JsonUtils.toJson(mojangAuth), MediaType.parse("application/json")))
                .build();

        try (var response = client.newCall(request).execute()) {
            return response.isSuccessful();
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
