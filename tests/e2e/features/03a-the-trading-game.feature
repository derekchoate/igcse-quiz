Feature: Module 3a — The Trading Game
  Rebuilding place value from a pile of beans: the ten-trade, opening bags,
  the two-trade that makes 1·2·4·8·16, and one pile read under three rules.

  Background:
    Given I open the module "03a-the-trading-game"
    Then the star count is 0

  Scenario: Discovery 1 — lining the pile up in tens makes it readable
    When I click "#groupBtn"
    Then the element "#pileCap1" contains "37"
    And discovery 1 is complete
    And the star count is 1
    When I click "#groupBtn"
    And I click "#groupBtn"
    Then discovery 1 is complete
    And the star count is 1

  Scenario: Discovery 2 — the tenth bean trades up, and 10 → 23 → 42 lights every chip
    When I open discovery 2
    And I click "#drop2" 9 times
    Then the element "#reads2" reads "9"
    When I click "#drop2"
    Then the element "#reads2" reads "10"
    And 1 chips are lit in "chips2"
    When I click "#hand2" 2 times
    And I click "#drop2" 3 times
    Then the element "#reads2" reads "23"
    And the element "#sums2" reads "20 + 3 = 23"
    And 2 chips are lit in "chips2"
    When I click "#hand2" 3 times
    And I click "#drop2" 4 times
    Then the element "#reads2" reads "42"
    And 3 chips are lit in "chips2"
    And discovery 2 is complete

  Scenario: Discovery 2 — taking a bean back un-trades it
    When I open discovery 2
    And I click "#drop2" 10 times
    Then the element "#reads2" reads "10"
    When I click "#take2"
    Then the element "#reads2" reads "9"

  Scenario: Discovery 3 — opening all three benches
    When I open discovery 3
    And I click "#bagTenBtn"
    Then the element "#benchTenCap" is visible
    And 1 chips are lit in "chips3"
    When I click "#bagHundredBtn"
    Then the element "#bagHundredMore" is visible
    When I click "#bagHundredMore"
    Then 2 chips are lit in "chips3"
    When I click "#spillBtn"
    Then the element "#benchSpillCap" is visible
    And 3 chips are lit in "chips3"
    And discovery 3 is complete

  Scenario: Discovery 4 — the two-trade builds binary readings and reveals cup values
    When I open discovery 4
    And I click "#drop4" 5 times
    Then the element "#total4" reads "5"
    And the element "#reads4" reads "101"
    And 1 chips are lit in "chips4"
    And plaque 4 in "machine4" reads "beans · worth 1"
    When I click "#drop4" 14 times
    Then the element "#total4" reads "19"
    And the element "#reads4" reads "10011"
    And 2 chips are lit in "chips4"
    When I click "#fourBagBtn"
    And I click "#fourBagMore"
    Then 3 chips are lit in "chips4"
    And discovery 4 is complete

  Scenario Outline: Discovery 5 — the same 19 beans read differently under each rule
    When I open discovery 5
    And I click "#<ruleButton>"
    Then the element "#reads5" reads "<reading>"
    And the element "#total5" reads "19"

    Examples:
      | ruleButton | reading |
      | ruleBtn2   | 10011   |
      | ruleBtn10  | 19      |
      | ruleBtn16  | 13      |

  Scenario: Discovery 5 — cycling all three rules lights every chip
    When I open discovery 5
    And I click "#ruleBtn2"
    Then 1 chips are lit in "chips5"
    When I click "#ruleBtn16"
    Then the element "#hexNote5" is visible
    And 2 chips are lit in "chips5"
    When I click "#ruleBtn10"
    Then 3 chips are lit in "chips5"
    And discovery 5 is complete

  @visual
  Scenario: Visual baseline
    Then the module matches its visual baseline
