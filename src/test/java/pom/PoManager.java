package pom;

import config.ConsentHandler;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class PoManager{

    private WebDriver driver;
    private Actions actions;

    private static final String BASE_URL = "https://www.calkoo.com/";

    public PoManager(WebDriver driver) {
        this.driver = driver;
        actions = new Actions(driver);
        goToHome();
    }

    private void goToHome(){
        driver.get(BASE_URL);
    }
    public VatPage toVatPage(){
//        ConsentHandler in case browser profile wont be used
        new ConsentHandler(driver).handleConsent();
        WebElement vatElement = driver.findElement(By.xpath("//a/div[text()='VAT']"));
        actions.moveToElement(vatElement).perform();
        vatElement.click();
        VatPage vatPage = new VatPage(driver);
        return vatPage;
    }
}
