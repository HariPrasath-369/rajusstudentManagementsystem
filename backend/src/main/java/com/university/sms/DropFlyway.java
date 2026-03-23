package com.university.sms;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DropFlyway {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://db.bgdwmcdtalvffzxxbyjf.supabase.co:5432/postgres";
        String user = "postgres";
        String password = "Ueqm.bUmf9AK8XW";
        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            stmt.execute("DROP TABLE IF EXISTS flyway_schema_history CASCADE");
            System.out.println("FLYWAY HISTORY DROPPED!");
            stmt.execute("DROP TABLE IF EXISTS hods CASCADE");
            stmt.execute("DROP TABLE IF EXISTS departments CASCADE");
            stmt.execute("DROP TABLE IF EXISTS users CASCADE");
            System.out.println("TABLES DROPPED!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
