package pom;

import enums.Country;
import enums.Language;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;

import java.math.BigDecimal;
import java.util.List;


public class VatPage {

    private WebDriver driver;
    private Actions actions;
    private BigDecimal defaultVat;

    public VatPage(WebDriver driver) {
        this.driver = driver;
        actions = new Actions(driver);
    }

    public void selectLanguage(Language selectedLanguage) {
        String language = selectedLanguage.toString();
        WebElement button = driver.findElement(By.id("dropdownLanguages"));
        button.click();
        WebElement languageDropList = driver.findElement(By
                .xpath("//ul[@class='multi-column-dropdown']/li/a[contains(.,'"+language+"')]"));
        languageDropList.click();
    }

    public void selectCountry(Country country){
        WebElement stateList = driver.findElement(By.xpath("//select[@name='Country']"));
        actions.moveToElement(stateList).perform();

        stateList.click();
        Select select = new Select(stateList);
        select.selectByValue(country.toString());
    }

    public BigDecimal getDefaultVat(){
        List<WebElement> vatElements = driver.findElements(By.xpath("//input[@name='VAT']"));
        defaultVat = null;
        for (WebElement vatElement : vatElements) {
            JavascriptExecutor js = (JavascriptExecutor) driver;
            boolean isChecked = (Boolean) js.executeScript("return arguments[0].checked;", vatElement);
            if(isChecked){
                String vatString = vatElement.findElement(By.xpath("following-sibling::label")).getText()
                        .replace("%", "").trim();
                defaultVat = new BigDecimal(vatString);
            }
        }
        return defaultVat;
    }

    public boolean inputChecker(String input){
        String regex = "^-?[0-9]+([.,][0-9]{2})?$";
        return input.matches(regex);
    }

    public void insertPriceWithVatCondition(boolean withVat, String enteredPrice){
        WebElement withoutVatElement = driver.findElement(By
                .xpath("//form[@id='vatcalculator']//input[@id='F1']"));
        WebElement withoutVatPriceElement = driver.findElement(By.xpath("//input[@name='NetPrice']"));
        WebElement withVatElement = driver.findElement(By
                .xpath("//form[@id='vatcalculator']//input[@id='F3']"));
        WebElement withVatPriceElement = driver.findElement(By.xpath("//input[@name='Price']"));

        boolean isCheckedVat = withVatElement.isSelected();
        boolean isCheckedWithoutVat = withoutVatElement.isSelected();

        JavascriptExecutor js = (JavascriptExecutor) driver;
        if(withVat){
            if(!isCheckedVat){
                js.executeScript("arguments[0].click();", withVatElement);
            }
            withVatPriceElement.sendKeys(enteredPrice);
        } else {
            if(!isCheckedWithoutVat){
                js.executeScript("arguments[0].click();", withoutVatElement);
            }
            withoutVatPriceElement.sendKeys(enteredPrice);
        }
    }

    public String getVat(){
        WebElement vat = getShadowElement("VATsum");
        return vat.getText();
    }

    public String getNetPrice(){
        WebElement netPrice = getShadowElement("NetPrice");
        return netPrice.getText();
    }

    public String getPrice(){
        WebElement price = getShadowElement("Price");
        return price.getText();
    }

    public boolean chartCheck(){
        List<WebElement> chartPath = driver.findElements(By.cssSelector("#chart_div svg > g > path"));
        boolean chart = !chartPath.isEmpty();
        return chart;
    }

    public String getErrorMessage(){
        WebElement errorMeesage = driver.findElement(By.xpath("//div[@id='chart_div']//div/span"));
        return errorMeesage.getText();
    }

    private WebElement getShadowElement(String shadowId){
        WebElement shadowHost = driver.findElement(By.cssSelector("#"+shadowId));
        SearchContext shadowRoot = shadowHost.getShadowRoot();
        return shadowRoot.findElement(By.cssSelector("div"));
    }

}
