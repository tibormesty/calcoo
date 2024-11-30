package hooks;

import config.DriverManager;
import context.TestContext;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import org.openqa.selenium.WebDriver;
import pom.PoManager;

public class Hooks {

    private final TestContext testContext;
    public Hooks(TestContext testContext) {
        this.testContext = testContext;
    }

    @Before
    public void setUp() {
        WebDriver driver = new DriverManager().getDriver("chrome");
        PoManager poManager = new PoManager(driver);
        testContext.setDriver(driver);
        testContext.setPoManager(poManager);
    }

    @After
    public void tearDown() {
        WebDriver driver = testContext.getDriver();
        if (driver != null) {
            driver.quit();
        }
    }
}
