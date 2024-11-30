package config;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import java.io.File;

public class DriverManager {

    private WebDriver driver;
    private static String profilePath = System.getProperty("user.dir") + File.separator + "profile";
//    private static String pathUblock = "C:/ublock";


    public WebDriver getDriver(String browser) throws IllegalArgumentException {
        if (driver == null) {
            switch (browser.toLowerCase()) {
                case "chrome":
                    WebDriverManager.chromedriver().setup();
                    ChromeOptions options = new ChromeOptions();
//                    Using browserProfile for cookies & addblocker for ads
                    options.addArguments("user-data-dir=" + profilePath);
//                    options.addArguments("load-extension="+pathUblock);
                    driver = new ChromeDriver(options);
                    driver.manage().window().maximize();
                    driver.get("about:blank");
//                    Sleep is used to activate adblock (depends on workstation performance)
                    try {
                        Thread.sleep(2000);
                    } catch (Exception e){}
                    break;
//                    Chrome config is only prepared
                case "firefox":
                    WebDriverManager.firefoxdriver().setup();
                    driver = new FirefoxDriver();
                    break;
                case "edge":
                    WebDriverManager.edgedriver().setup();
                    driver = new EdgeDriver();
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported browser: " + browser);
            }
        }
        return driver;
    }

    public void quitDriver() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }

}
