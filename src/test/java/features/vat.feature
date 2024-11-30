Feature: VAT calculator

  #VAT countries: SK, CZ, UK, DE, FR, ES, IT
  #Languagies: SK, CZ, DE, FR, ES, IT
  Scenario Outline: VAT prices calculator - country specific
    Given the user is on calkoo.com website and goes to VAT subpage
    And the user selects "EN" language and "<country>" VAT country
    When the user fill in the price "<price>" "<VAT>" VAT
    Then the prices and VAT calculations are displayed and verified
    And VAT chart "is" displayed to the user
  Examples:
    | country | price     | VAT     |
    | SK      | 123.50    | with    |
    | CZ      | 3255.50   | without |
    | DE      | 124.50    | with    |

  Scenario: Negative price output
    Given the user is on calkoo.com website and goes to VAT subpage
    And the user selects "EN" language and "CZ" VAT country
    When the user fill in the price "-100" "without" VAT
    Then negative values error message is displayed
    And VAT chart "is not" displayed to the user