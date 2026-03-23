package com.university.sms.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods that are expected to be slow or need performance monitoring.
 * Used by PerformanceAspect to measure and log execution time.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Slow {
    /**
     * Optional threshold in milliseconds. If execution time exceeds this, it's logged as a warning.
     * Default depends on the aspect implementing it.
     */
    long threshold() default 0;
}
