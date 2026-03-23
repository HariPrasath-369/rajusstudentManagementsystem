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
            System.out.println("flyway_schema_history dropped successfully.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
