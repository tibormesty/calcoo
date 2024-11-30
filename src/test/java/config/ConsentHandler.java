package config;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class ConsentHandler {

    private WebDriver driver;

    public ConsentHandler(WebDriver driver) {
        this.driver = driver;
    }

    public void handleConsent() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            WebElement consentButton = wait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("//button/p[contains(text(),'Consent')]")
            ));
            consentButton.click();
        } catch (Exception e) {
            System.out.println("No consent pop-up detected or already handled.");
        }
    }
}
