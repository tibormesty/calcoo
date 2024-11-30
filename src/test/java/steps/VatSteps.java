package steps;

import context.TestContext;
import enums.Country;
import enums.Language;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import pom.PoManager;
import pom.VatPage;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;


public class VatSteps {

    public VatSteps(TestContext testContext) {
        this.driver = testContext.getDriver();
        this.poManager = testContext.getPoManager();
    }

    private WebDriver driver;
    private PoManager poManager;
    private VatPage vatPage;
    private String price;
    private boolean withVat;
    private boolean displayed;


    @Given("the user is on calkoo.com website and goes to VAT subpage")
    public void goToVatPage() {
        vatPage = poManager.toVatPage();
        Assert.assertTrue(driver.getTitle().contains("VAT"));
    }

    @And("the user selects {string} language and {string} VAT country")
    public void selectLanguage(String language, String country){
        vatPage.selectLanguage(Language.valueOf(language));
        String selectedLanguage = driver.findElement(By.xpath("//a[@id='dropdownLanguages']"))
                .getText().strip().toLowerCase();
        Assert.assertEquals("Language is not selected correctly"
                , selectedLanguage, Language.valueOf(language).toString().toLowerCase());
        vatPage.selectCountry(Country.valueOf(country));
    }

    @When("the user fill in the price {string} {string} VAT")
    public void fillInPriceAndSelectVat(String price, String withVat){
        this.price = price;
        this.withVat = "with".equalsIgnoreCase(withVat);
        Assert.assertTrue("Filled in price is not in correct format (100 / 100.00)",vatPage.inputChecker(price));
        vatPage.insertPriceWithVatCondition(this.withVat, price);
    }

    @Then("negative values error message is displayed")
    public void checkNegativePriceError(){
        String errorMessage = vatPage.getErrorMessage();
        Assert.assertTrue("Error message is not displayed"
                , errorMessage.contains("Negative values are invalid for a pie chart"));
    }

    @Then("the prices and VAT calculations are displayed and verified")
    public void verifyPriceCalculation(){
        String insertedPriceString = this.price;
        BigDecimal insertedPrice = new BigDecimal(insertedPriceString).setScale(2);
        BigDecimal expectedVat = new BigDecimal(vatPage.getVat());
        BigDecimal expectedPrice;
        BigDecimal vatCalculation;

        BigDecimal defaultVat = vatPage.getDefaultVat().divide(new BigDecimal(100));

        if(this.withVat){
            expectedPrice = new BigDecimal(vatPage.getNetPrice());
            vatCalculation = insertedPrice
                            .multiply(defaultVat.divide(new BigDecimal(1).add(defaultVat), new MathContext(6)))
                    .setScale(2, RoundingMode.HALF_UP);
            Assert.assertEquals("Expected without VAT price is not calculated correctly"
                    , expectedPrice, insertedPrice.subtract(vatCalculation));
            Assert.assertEquals("VAT amount is not calculated correctly", expectedVat, vatCalculation);
        } else {
            expectedPrice = new BigDecimal(vatPage.getPrice());
            vatCalculation = insertedPrice.multiply(defaultVat).setScale(2, RoundingMode.HALF_UP);
            Assert.assertEquals("Expected with VAT price is not calculated correctly"
                    , expectedPrice, insertedPrice.add(vatCalculation));
            Assert.assertEquals("VAT amount is not calculated correctly", expectedVat, vatCalculation);
        }
    }

    @And("VAT chart {string} displayed to the user")
    public void yesTest(String displayed){
        this.displayed = "is".equalsIgnoreCase(displayed);
        if(this.displayed){
            Assert.assertTrue("Chart is not displayed to the user", vatPage.chartCheck());
        } else {
            Assert.assertFalse("Chart is displayed to the user insted error message"
                    , vatPage.chartCheck());
        }
    }
}
