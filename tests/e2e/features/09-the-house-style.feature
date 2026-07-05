Feature: Module 9 — The House Style
  Reading Cambridge's pseudocode dialect: the ← arrow, DECLARE, reading a
  snippet, meaningful names, and comments.

  Background:
    Given I open the module "09-the-house-style"
    Then the star count is 0

  Scenario: Discovery 1 — the arrow assigns, and a box may sit on both sides
    When I click "#getsLines1 .gets-line[data-line='set']"
    Then the element "#getsVal1" reads "10"
    When I click "#getsLines1 .gets-line[data-line='add']"
    Then the element "#getsVal1" reads "15"
    When I click "#getsLines1 .gets-line[data-line='mul']"
    Then the element "#getsVal1" reads "30"
    And discovery 1 is complete
    And the star count is 1

  Scenario: Discovery 2 — DECLARE makes empty boxes, then fills them
    When I open discovery 2
    And I click "#declStep2"
    Then 1 elements match "#declBoxes2 .vbox"
    When I click "#declStep2"
    Then 2 elements match "#declBoxes2 .vbox"
    When I click "#declStep2"
    Then 1 elements match "#declBoxes2 .vbox.filled"
    When I click "#declStep2"
    Then 2 elements match "#declBoxes2 .vbox.filled"
    And discovery 2 is complete

  Scenario: Discovery 3 — read each line, then pair every meaning to its code
    When I open discovery 3
    And I click "#tsNext3"
    Then row 0 of discovery 3 has been read
    And row 1 of discovery 3 has not been read
    When I pair meaning 0 with code line 0 in discovery 3
    Then the element "#pairCode3 .pair-slot[data-line='0']" has the class "filled"
    When I pair meaning 1 with code line 1 in discovery 3
    And I pair meaning 2 with code line 2 in discovery 3
    And I pair meaning 3 with code line 3 in discovery 3
    And I pair meaning 4 with code line 4 in discovery 3
    And I pair meaning 5 with code line 5 in discovery 3
    Then discovery 3 is complete

  Scenario: Discovery 4 — good names make the algorithm read itself
    When I open discovery 4
    And I select "Price" in "#rnRows4 select[aria-label='rename box a']"
    And I select "Quantity" in "#rnRows4 select[aria-label='rename box b']"
    And I select "Total" in "#rnRows4 select[aria-label='rename box c']"
    Then the element "#rnReadable4" has the class "show"
    And discovery 4 is complete

  Scenario: Discovery 5 — a comment is a note the machine ignores
    When I open discovery 5
    And I click "#cmReveal5"
    And I click "#cmRun5"
    Then the element "#cmOut5" contains "15"
    And the element "#cmComment5" has the class "off"
    And discovery 5 is complete

  @visual
  Scenario: Visual baseline
    Then the module matches its visual baseline
