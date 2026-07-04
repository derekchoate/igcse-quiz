Feature: Module 3 — Switch Arithmetic
  Two rows of switches add themselves; a byte overflows, shifts, and counts
  below zero.

  Background:
    Given I open the module "03-switch-arithmetic"
    Then the star count is 0

  Scenario: Discovery 1 — the four addition facts, including the carry
    When I click "#bitA1"
    Then the element "#factExpr1" reads "1 + 0 = 1"
    When I click "#bitB1"
    Then the element "#factExpr1" reads "1 + 1 = 10"
    When I click "#bitA1"
    Then the element "#factExpr1" reads "0 + 1 = 1"
    When I click "#bitB1"
    Then the element "#factExpr1" reads "0 + 0 = 0"
    And 4 chips are lit in "chips1"
    And discovery 1 is complete
    And the star count is 1

  Scenario: Discovery 2 — carry chains reach true sums 50, 128 and 199
    When I open discovery 2
    And I set row "rowA2" to make 50
    Then the total "totalSum2" reads 50
    When I set row "rowA2" to make 128
    Then the total "totalSum2" reads 128
    When I set row "rowA2" to make 199
    Then the total "totalSum2" reads 199
    And 3 chips are lit in "chips2"
    And discovery 2 is complete

  Scenario Outline: Discovery 3 — pushing the true total past 255 overflows the byte
    When I open discovery 3
    And I set row "rowA3" to make <a>
    And I set row "rowB3" to make <b>
    Then the element "#trueSum3" reads "<true>"
    And the total "totalSum3" reads <byte>
    And the element "#overflowNote3" is visible

    Examples:
      | a   | b   | true | byte |
      | 128 | 128 | 256  | 0    |
      | 200 | 100 | 300  | 44   |
      | 255 | 255 | 510  | 254  |

  Scenario: Discovery 3 — meeting all three overflows completes it
    When I open discovery 3
    And I set row "rowA3" to make 128
    And I set row "rowB3" to make 128
    And I set row "rowA3" to make 200
    And I set row "rowB3" to make 100
    And I set row "rowA3" to make 255
    And I set row "rowB3" to make 255
    Then 3 chips are lit in "chips3"
    And discovery 3 is complete

  Scenario: Discovery 4 — shift left doubles and shift right halves
    When I open discovery 4
    Then the total "total4" reads 3
    When I click "#shiftLeftBtn"
    Then the total "total4" reads 6
    When I click "#shiftRightBtn"
    Then the total "total4" reads 3

  Scenario: Discovery 5 — flip and add one reach a negative total
    When I open discovery 5
    Then the total "total5" reads 19
    When I click "#flipBtn"
    And I click "#addOneBtn"
    And I click "#lensBtn"
    Then the total "total5" reads -19
    And the element "#lensNote5" is visible

  @visual
  Scenario: Visual baseline
    Then the module matches its visual baseline
