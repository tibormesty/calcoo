package context;

import org.openqa.selenium.WebDriver;
import pom.PoManager;

public class TestContext {
    private WebDriver driver;
    private PoManager poManager;
    public WebDriver getDriver() {
        return driver;
    }

    public void setDriver(WebDriver driver) {
        this.driver = driver;
    }

    public PoManager getPoManager() {
        return poManager;
    }

    public void setPoManager(PoManager poManager){
        this.poManager = poManager;
    }

}
