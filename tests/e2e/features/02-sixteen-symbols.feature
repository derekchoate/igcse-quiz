Feature: Module 2 — Sixteen Symbols
  Hexadecimal: splitting a byte into nibbles, the sixteen symbols, mixing
  colour, and reading hex in the wild — one star per discovery.

  Background:
    Given I open the module "02-sixteen-symbols"
    Then the star count is 0

  Scenario: Discovery 1 — feel the problem by shuffling the byte
    When I click "#shuffleBtn" 3 times
    Then discovery 1 is complete
    And the star count is 1

  Scenario: Discovery 2 — split the byte into high and low nibbles
    When I open discovery 2
    And I set row 2 to make 197
    Then the element "#left2 b" reads "12"
    And the element "#right2 b" reads "5"
    When I set row 2 to make 62
    Then the element "#left2 b" reads "3"
    And the element "#right2 b" reads "14"
    And 3 chips are lit in "chips2"
    And discovery 2 is complete

  Scenario Outline: Discovery 3 — a byte reads as a two-symbol hex value
    When I open discovery 3
    And I set row 3 to make <dec>
    Then the element "#hex3 b" reads "<hex>"

    Examples:
      | dec | hex |
      | 42  | 2A  |
      | 255 | FF  |
      | 195 | C3  |

  Scenario: Discovery 3 — reading 2A, FF and C3 completes it
    When I open discovery 3
    And I set row 3 to make 42
    And I set row 3 to make 255
    And I set row 3 to make 195
    Then 3 chips are lit in "chips3"
    And discovery 3 is complete

  Scenario: Discovery 4 — mixing R, G and B reaches red, yellow, green and white
    When I open discovery 4
    And I set the "red" channel to 255
    Then the element "#swatchHex" reads "#FF0000"
    When I set the "green" channel to 255
    Then the element "#swatchHex" reads "#FFFF00"
    When I set the "red" channel to 0
    Then the element "#swatchHex" reads "#00FF00"
    When I set the "red" channel to 255
    And I set the "blue" channel to 255
    Then the element "#swatchHex" reads "#FFFFFF"
    And 4 chips are lit in "chips4"
    And discovery 4 is complete

  Scenario: Discovery 5 — reading 4D and A7 from a MAC address
    When I open discovery 5
    And I set row 5 to make 77
    Then the element "#hex5 b" reads "4D"
    When I set row 5 to make 167
    Then the element "#hex5 b" reads "A7"
    And 2 chips are lit in "chips5"
    And discovery 5 is complete

  @visual
  Scenario: Visual baseline
    Then the module matches its visual baseline
