package com.university.sms.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.university.sms.annotation.Slow;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Aspect
@Component
public class PerformanceAspect {

    private static final Logger logger = LoggerFactory.getLogger(PerformanceAspect.class);
    
    // Store performance metrics
    private static final Map<String, MethodMetrics> metrics = new ConcurrentHashMap<>();
    
    // Pointcut for all controller methods
    @Pointcut("execution(* com.university.sms.controller.*.*(..))")
    public void controllerMethods() {}
    
    // Pointcut for all service methods
    @Pointcut("execution(* com.university.sms.service.*.*(..))")
    public void serviceMethods() {}
    
    // Pointcut for slow methods (annotated with @Slow)
    @Pointcut("@annotation(com.university.sms.annotation.Slow)")
    public void slowMethods() {}

    // Measure performance of controller methods
    @Around("controllerMethods()")
    public Object measureControllerPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;
            
            // Log slow controller methods
            if (executionTime > 5000) { // 5 seconds threshold
                logger.warn("SLOW CONTROLLER: {} took {} ms", methodName, executionTime);
            } else if (executionTime > 1000) {
                logger.info("Controller performance: {} took {} ms", methodName, executionTime);
            }
            
            // Record metrics
            recordMetrics(methodName, executionTime, true);
            
            return result;
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            recordMetrics(methodName, executionTime, false);
            throw e;
        }
    }
    
    // Measure performance of service methods
    @Around("serviceMethods()")
    public Object measureServicePerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;
            
            // Log slow service methods
            if (executionTime > 3000) { // 3 seconds threshold for services
                logger.warn("SLOW SERVICE: {} took {} ms", methodName, executionTime);
            }
            
            // Record metrics
            recordMetrics(methodName, executionTime, true);
            
            return result;
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            recordMetrics(methodName, executionTime, false);
            throw e;
        }
    }
    
    // Measure performance of methods annotated with @Slow
    @Around("@annotation(slowAnnotation)")
    public Object measureSlowMethods(ProceedingJoinPoint joinPoint, Slow slowAnnotation) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;
            
            logger.info("Slow method execution: {} took {} ms", methodName, executionTime);
            
            return result;
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            logger.error("Slow method failed: {} after {} ms", methodName, executionTime, e);
            throw e;
        }
    }
    
    // Monitor database query performance
    @Around("execution(* com.university.sms.repository.*.*(..))")
    public Object measureDatabasePerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;
            
            // Log slow database queries
            if (executionTime > 1000) { // 1 second threshold for DB queries
                logger.warn("SLOW DATABASE QUERY: {} took {} ms", methodName, executionTime);
                
                // Log query parameters for debugging
                Object[] args = joinPoint.getArgs();
                if (args != null && args.length > 0) {
                    logger.debug("Query parameters: {}", args);
                }
            }
            
            return result;
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            logger.error("Database query failed: {} after {} ms", methodName, executionTime, e);
            throw e;
        }
    }
    
    // Monitor memory usage
    @Before("controllerMethods()")
    public void monitorMemoryUsage() {
        Runtime runtime = Runtime.getRuntime();
        long usedMemory = runtime.totalMemory() - runtime.freeMemory();
        long maxMemory = runtime.maxMemory();
        double memoryUsagePercent = (usedMemory * 100.0) / maxMemory;
        
        if (memoryUsagePercent > 80) {
            logger.warn("High memory usage: {}% (Used: {} MB, Max: {} MB)", 
                       Math.round(memoryUsagePercent),
                       usedMemory / (1024 * 1024),
                       maxMemory / (1024 * 1024));
        }
    }
    
    // Monitor active sessions
    @Before("controllerMethods()")
    public void monitorActiveRequests() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String uri = request.getRequestURI();
            
            // Track active requests
            ActiveRequestTracker.addRequest(uri);
            
            if (ActiveRequestTracker.getActiveCount() > 50) {
                logger.warn("High concurrent requests: {}", ActiveRequestTracker.getActiveCount());
            }
        }
    }
    
    @After("controllerMethods()")
    public void cleanupActiveRequests() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String uri = request.getRequestURI();
            ActiveRequestTracker.removeRequest(uri);
        }
    }
    
    // Record performance metrics
    private void recordMetrics(String methodName, long executionTime, boolean success) {
        MethodMetrics methodMetrics = metrics.computeIfAbsent(methodName, k -> new MethodMetrics());
        methodMetrics.addExecution(executionTime, success);
        
        // Log metrics summary every 100 executions
        if (methodMetrics.getTotalExecutions() % 100 == 0) {
            logger.info("Performance metrics for {}: Avg: {} ms, Min: {} ms, Max: {} ms, Success Rate: {}%",
                       methodName,
                       methodMetrics.getAverageTime(),
                       methodMetrics.getMinTime(),
                       methodMetrics.getMaxTime(),
                       methodMetrics.getSuccessRate());
        }
    }
    
    // Get performance metrics (can be exposed via actuator endpoint)
    public static Map<String, MethodMetrics> getPerformanceMetrics() {
        return new ConcurrentHashMap<>(metrics);
    }
    
    // Reset metrics
    public static void resetMetrics() {
        metrics.clear();
        logger.info("Performance metrics reset");
    }
    
    // Inner class to store method metrics
    public static class MethodMetrics {
        private final AtomicLong totalTime = new AtomicLong(0);
        private final AtomicLong totalExecutions = new AtomicLong(0);
        private final AtomicLong successfulExecutions = new AtomicLong(0);
        private long minTime = Long.MAX_VALUE;
        private long maxTime = 0;
        
        public synchronized void addExecution(long executionTime, boolean success) {
            totalTime.addAndGet(executionTime);
            totalExecutions.incrementAndGet();
            if (success) {
                successfulExecutions.incrementAndGet();
            }
            
            minTime = Math.min(minTime, executionTime);
            maxTime = Math.max(maxTime, executionTime);
        }
        
        public long getAverageTime() {
            long executions = totalExecutions.get();
            return executions > 0 ? totalTime.get() / executions : 0;
        }
        
        public long getMinTime() {
            return minTime == Long.MAX_VALUE ? 0 : minTime;
        }
        
        public long getMaxTime() {
            return maxTime;
        }
        
        public long getTotalExecutions() {
            return totalExecutions.get();
        }
        
        public double getSuccessRate() {
            long executions = totalExecutions.get();
            return executions > 0 ? (successfulExecutions.get() * 100.0) / executions : 0;
        }
    }
    
    // Inner class to track active requests
    private static class ActiveRequestTracker {
        private static final Map<String, Integer> activeRequests = new ConcurrentHashMap<>();
        
        public static void addRequest(String uri) {
            activeRequests.merge(uri, 1, Integer::sum);
        }
        
        public static void removeRequest(String uri) {
            activeRequests.computeIfPresent(uri, (k, v) -> v > 1 ? v - 1 : null);
        }
        
        public static int getActiveCount() {
            return activeRequests.values().stream().mapToInt(Integer::intValue).sum();
        }
        
        public static Map<String, Integer> getActiveRequests() {
            return new ConcurrentHashMap<>(activeRequests);
        }
    }
}