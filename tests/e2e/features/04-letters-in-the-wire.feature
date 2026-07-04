Feature: Module 4 — Letters in the Wire
  ASCII as the agreed character set: rival codebooks, neighbourhood ranges,
  the case bit, ASCII's 128-slot wall, and encoding/decoding the wire.

  Background:
    Given I open the module "04-letters-in-the-wire"
    Then the star count is 0

  Scenario: Discovery 1 — one byte, two codebooks reading it differently
    Then the element "#cardA1" reads "H"
    And the element "#cardB1" reads "S"

  Scenario: Discovery 1 — comparing three distinct capitals awards the star
    When I set row 1 to make 65
    And I set row 1 to make 66
    And I set row 1 to make 67
    Then 3 chips are lit in "chips1"
    And discovery 1 is complete
    And the star count is 1

  Scenario: Discovery 2 — landing in the digit, capital and lowercase streets
    When I open discovery 2
    And I set row 2 to make 48
    And I set row 2 to make 65
    And I set row 2 to make 97
    Then the element "#char2" reads "a"
    And 3 chips are lit in "chips2"
    And discovery 2 is complete

  Scenario: Discovery 3 — the weight-32 bulb flips case on two different letters
    When I open discovery 3
    Then the element "#char3" reads "A"
    When I set row 3 to make 97
    And I set row 3 to make 65
    And I set row 3 to make 66
    And I set row 3 to make 98
    Then the element "#char3" reads "b"
    And 3 chips are lit in "chips3"
    And discovery 3 is complete

  Scenario: Discovery 4 — an ordinary letter fits and é overflows ASCII
    When I open discovery 4
    And I type "Q" into "#d4input"
    Then the element "#d4code" reads "81"
    And the element "#d4verdict" contains "Fits"
    And 1 chips are lit in "chips4"
    When I click "#fillAccent"
    Then the element "#d4code" reads "233"
    And the element "#d4verdict" contains "Too big"
    And 2 chips are lit in "chips4"
    And discovery 4 is complete

  Scenario Outline: Discovery 4 — characters ASCII was never built to hold
    When I open discovery 4
    And I click "<button>"
    Then the element "#d4code" reads "<code>"
    And the element "#d4verdict" contains "Too big"

    Examples:
      | button      | code  |
      | #fillAccent | 233   |
      | #fillHan    | 20013 |

  Scenario: Discovery 5 — encoding a word renders one byte column per character
    When I open discovery 5
    And I type "Hi" into "#encodeInput"
    Then 2 elements match "#encodeRow .encode-col"
    And the element "#encodeRow .encode-col:nth-child(1) .encode-char" reads "H"
    And the element "#encodeRow .encode-col:nth-child(1) .encode-code" reads "72"
    And the element "#encodeRow .encode-col:nth-child(2) .encode-char" reads "i"
    And the element "#encodeRow .encode-col:nth-child(2) .encode-code" reads "105"

  Scenario: Discovery 5 — a wrong pick redirects gently, decoding SHARP awards the star
    When I open discovery 5
    And I select "A" in "#decodeBoard .decode-row:nth-child(1) select"
    Then the element "#decodeBoard .decode-row:nth-child(1) select" does not have the class "locked"
    And the element "#toast" contains "A is number 65"
    When I select "S" in "#decodeBoard .decode-row:nth-child(1) select"
    And I select "H" in "#decodeBoard .decode-row:nth-child(2) select"
    And I select "A" in "#decodeBoard .decode-row:nth-child(3) select"
    And I select "R" in "#decodeBoard .decode-row:nth-child(4) select"
    And I select "P" in "#decodeBoard .decode-row:nth-child(5) select"
    Then the element "#decodeNote" has the class "shown"
    And discovery 5 is complete

  @visual
  Scenario: Visual baseline
    Then the module matches its visual baseline
