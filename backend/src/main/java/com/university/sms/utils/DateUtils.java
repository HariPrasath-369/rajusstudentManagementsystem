package com.university.sms.utils;

import java.time.LocalDate;
import java.time.Month;

public class DateUtils {
    public static int getSemesterFromDate(LocalDate date) {
        Month month = date.getMonth();
        return (month.getValue() >= Month.JULY.getValue()) ? 2 : 1;
    }

    public static LocalDate getStartOfSemester(int year, int semester) {
        return (semester == 1) ? LocalDate.of(year, 1, 1) : LocalDate.of(year, 7, 1);
    }
}