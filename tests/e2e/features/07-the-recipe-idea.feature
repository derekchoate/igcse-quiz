Feature: Module 7 — The Recipe Idea
  Decomposition and the four stages of building software: walk a wish through
  the stages, then sort real gadget steps into Input, Process, Output, Storage.

  Background:
    Given I open the module "07-the-recipe-idea"
    Then the star count is 0

  Scenario: Discovery 1 — visiting all four stages awards the star
    When I visit every stage in discovery 1
    Then discovery 1 is complete
    And the star count is 1

  Scenario: Discovery 2 — sorting all four gadget steps into their jobs
    When I open discovery 2
    And I sort the step "moisture sensor" as "Input" in discovery 2
    And I sort the step "soil counts" as "Process" in discovery 2
    And I sort the step "pump on" as "Output" in discovery 2
    And I sort the step "last watered" as "Storage" in discovery 2
    Then discovery 2 is complete

  Scenario: Discovery 2 — a wrong bucket redirects without locking
    When I open discovery 2
    And I sort the step "moisture sensor" as "Output" in discovery 2
    Then the step "moisture sensor" in discovery 2 is not solved
    And the element "#toast" contains "does it come from outside"
    And discovery 2 is not complete

  Scenario: Discovery 3 — sorting all six canteen steps
    When I open discovery 3
    And I sort the step "barcode scanner" as "Input" in discovery 3
    And I sort the step "price list" as "Storage" in discovery 3
    And I sort the step "change to give back" as "Process" in discovery 3
    And I sort the step "receipt printing" as "Output" in discovery 3
    And I sort the step "running sales total" as "Storage" in discovery 3
    And I sort the step "Adding this sale" as "Process" in discovery 3
    Then discovery 3 is complete

  Scenario Outline: Discovery 3 — the price-list step accepts either bucket
    When I open discovery 3
    And I sort the step "price list" as "<category>" in discovery 3
    Then the step "price list" in discovery 3 is solved

    Examples:
      | category |
      | Input    |
      | Storage  |

  Scenario Outline: Discovery 4 — each wrong choice gives its own redirect, none lock
    When I open discovery 4
    And I choose "<choice>" in the decomposition
    Then the element "#toast" contains "<redirect>"
    And discovery 4 is not complete

    Examples:
      | choice                       | redirect                    |
      | A brighter light by the door | doesn't fix the actual hole |
      | The doorbell button          | already on the board        |

  Scenario: Discovery 4 — the correct choice fills the Output column
    When I open discovery 4
    And I choose "A notification sent to your phone" in the decomposition
    Then the Output column shows "A notification sent to your phone"
    And discovery 4 is complete

  Scenario: Discovery 5 — filling only some boxes does not award the star
    When I open discovery 5
    And I fill the decomposition box "input" with "something"
    And I fill the decomposition box "process" with "something"
    And I fill the decomposition box "output" with "something"
    Then discovery 5 is not complete

  Scenario: Discovery 5 — filling all four boxes awards the star
    When I open discovery 5
    And I fill the decomposition box "input" with "something"
    And I fill the decomposition box "process" with "something"
    And I fill the decomposition box "output" with "something"
    And I fill the decomposition box "storage" with "something else"
    Then discovery 5 is complete

  @visual
  Scenario: Visual baseline
    Then the module matches its visual baseline
