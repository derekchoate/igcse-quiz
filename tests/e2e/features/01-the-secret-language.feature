Feature: Module 1 — The Secret Language
  Flipping weighted switches builds a running total; reaching each target earns
  a star. Stars only ever accumulate.

  Background:
    Given I open the module "01-the-secret-language"
    Then the star count is 0

  Scenario: Discovery 1 — three flips of the single switch earns a star
    When I flip the bulb with weight 1 in row 1
    And I flip the bulb with weight 1 in row 1
    Then the star count is 0
    When I flip the bulb with weight 1 in row 1
    Then discovery 1 is complete
    And the star count is 1

  Scenario Outline: Discovery 2 — two switches can reach every total
    When I open discovery 2
    And I set row 2 to make <total>
    Then the total "total2" reads <total>
    And the total "total2" is matched

    Examples:
      | total |
      | 1     |
      | 2     |
      | 3     |

  Scenario: Discovery 3 — a nudge is available and never penalised
    When I open discovery 3
    And I ask for nudge "n3a"
    Then nudge "n3a" is visible

  @visual
  Scenario: Visual baseline of the whole module
    Then the module matches its visual baseline
