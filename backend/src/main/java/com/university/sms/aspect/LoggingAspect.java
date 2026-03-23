package com.university.sms.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    // Pointcut for all controller methods
    @Pointcut("execution(* com.university.sms.controller.*.*(..))")
    public void controllerMethods() {}

    // Pointcut for all service methods
    @Pointcut("execution(* com.university.sms.service.*.*(..))")
    public void serviceMethods() {}

    // Pointcut for all repository methods
    @Pointcut("execution(* com.university.sms.repository.*.*(..))")
    public void repositoryMethods() {}

    // Log before controller method execution
    @Before("controllerMethods()")
    public void logBeforeController(JoinPoint joinPoint) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            
            Map<String, Object> logData = new HashMap<>();
            logData.put("timestamp", LocalDateTime.now());
            logData.put("method", request.getMethod());
            logData.put("uri", request.getRequestURI());
            logData.put("clientIp", getClientIp(request));
            logData.put("userAgent", request.getHeader("User-Agent"));
            logData.put("controller", joinPoint.getSignature().toShortString());
            logData.put("arguments", getArguments(joinPoint.getArgs()));
            
            logger.info("API Request: {}", formatLogData(logData));
        }
    }

    // Log after controller method execution (success)
    @AfterReturning(pointcut = "controllerMethods()", returning = "result")
    public void logAfterController(JoinPoint joinPoint, Object result) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            
            Map<String, Object> logData = new HashMap<>();
            logData.put("timestamp", LocalDateTime.now());
            logData.put("uri", request.getRequestURI());
            logData.put("controller", joinPoint.getSignature().toShortString());
            logData.put("response", result != null ? result.toString() : "null");
            logData.put("status", "SUCCESS");
            
            logger.info("API Response: {}", formatLogData(logData));
        }
    }

    // Log when controller method throws exception
    @AfterThrowing(pointcut = "controllerMethods()", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint, Exception exception) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            
            Map<String, Object> logData = new HashMap<>();
            logData.put("timestamp", LocalDateTime.now());
            logData.put("uri", request.getRequestURI());
            logData.put("controller", joinPoint.getSignature().toShortString());
            logData.put("exception", exception.getClass().getSimpleName());
            logData.put("message", exception.getMessage());
            logData.put("status", "ERROR");
            
            logger.error("API Exception: {}", formatLogData(logData), exception);
        }
    }

    // Log service method execution
    @Around("serviceMethods()")
    public Object logServiceMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        Object[] args = joinPoint.getArgs();
        
        logger.debug("Service method called: {} with arguments: {}", 
                    methodName, getArguments(args));
        
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            
            long executionTime = System.currentTimeMillis() - startTime;
            
            logger.debug("Service method completed: {} in {} ms", 
                        methodName, executionTime);
            
            return result;
        } catch (Exception e) {
            logger.error("Service method failed: {} - Error: {}", 
                        methodName, e.getMessage(), e);
            throw e;
        }
    }

    // Log repository method execution
    @Around("repositoryMethods()")
    public Object logRepositoryMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            
            long executionTime = System.currentTimeMillis() - startTime;
            
            if (executionTime > 1000) { // Log slow queries (> 1 second)
                logger.warn("Slow repository query: {} took {} ms", 
                           methodName, executionTime);
            } else {
                logger.debug("Repository query: {} executed in {} ms", 
                            methodName, executionTime);
            }
            
            return result;
        } catch (Exception e) {
            logger.error("Repository query failed: {} - Error: {}", 
                        methodName, e.getMessage(), e);
            throw e;
        }
    }

    // Log user authentication events
    @Before("execution(* com.university.sms.service.AuthService.authenticateUser(..))")
    public void logAuthenticationAttempt(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        if (args.length > 0) {
            Object loginRequest = args[0];
            try {
                String email = (String) loginRequest.getClass().getMethod("getEmail").invoke(loginRequest);
                logger.info("Authentication attempt for email: {}", email);
            } catch (Exception e) {
                logger.warn("Failed to extract email from login request");
            }
        }
    }

    // Log after successful authentication
    @AfterReturning(pointcut = "execution(* com.university.sms.service.AuthService.authenticateUser(..))", 
                    returning = "result")
    public void logSuccessfulAuthentication(JoinPoint joinPoint, Object result) {
        try {
            String email = (String) result.getClass().getMethod("getEmail").invoke(result);
            logger.info("User successfully authenticated: {}", email);
        } catch (Exception e) {
            logger.info("User successfully authenticated");
        }
    }

    // Log failed authentication attempts
    @AfterThrowing(pointcut = "execution(* com.university.sms.service.AuthService.authenticateUser(..))", 
                   throwing = "exception")
    public void logFailedAuthentication(JoinPoint joinPoint, Exception exception) {
        Object[] args = joinPoint.getArgs();
        if (args.length > 0) {
            Object loginRequest = args[0];
            try {
                String email = (String) loginRequest.getClass().getMethod("getEmail").invoke(loginRequest);
                logger.warn("Failed authentication attempt for email: {} - Reason: {}", 
                           email, exception.getMessage());
            } catch (Exception e) {
                logger.warn("Failed authentication attempt - Reason: {}", exception.getMessage());
            }
        }
    }

    // Log data modifications (create, update, delete)
    @AfterReturning(pointcut = "execution(* com.university.sms.service.*.*(..)) && " +
                    "(@annotation(org.springframework.transaction.annotation.Transactional) || " +
                    "execution(* com.university.sms.service.*.create*(..)) || " +
                    "execution(* com.university.sms.service.*.update*(..)) || " +
                    "execution(* com.university.sms.service.*.delete*(..)))", 
                    returning = "result")
    public void logDataModification(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().toShortString();
        Object[] args = joinPoint.getArgs();
        
        Map<String, Object> logData = new HashMap<>();
        logData.put("timestamp", LocalDateTime.now());
        logData.put("operation", methodName);
        logData.put("arguments", getArguments(args));
        logData.put("result", result != null ? result.toString() : "null");
        
        logger.info("Data Modification: {}", formatLogData(logData));
    }

    // Helper methods
    private String getArguments(Object[] args) {
        if (args == null || args.length == 0) {
            return "[]";
        }
        
        return Arrays.stream(args)
                .map(arg -> {
                    if (arg == null) return "null";
                    if (arg instanceof String) return "\"" + arg + "\"";
                    if (arg instanceof Number || arg instanceof Boolean) return arg.toString();
                    return arg.getClass().getSimpleName();
                })
                .collect(Collectors.joining(", ", "[", "]"));
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String formatLogData(Map<String, Object> logData) {
        try {
            return objectMapper.writeValueAsString(logData);
        } catch (Exception e) {
            return logData.toString();
        }
    }
}