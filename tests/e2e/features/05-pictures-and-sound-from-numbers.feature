Feature: Module 5 — Pictures and Sound from Numbers
  Painting with bits, colour depth, resolution, sound sampling and the
  quality/size trade-off, each awarding one permanent star.

  Background:
    Given I open the module "05-pictures-and-sound-from-numbers"
    Then the star count is 0

  Scenario: Discovery 1 — paint a pixel, fill a row, then clear it back to black
    When I paint pixel 0 in the grid
    Then 1 pixels are lit in the binary mirror
    And 1 chips are lit in "chips1"
    When I paint pixel 1 in the grid
    And I paint pixel 2 in the grid
    And I paint pixel 3 in the grid
    And I paint pixel 4 in the grid
    Then 5 pixels are lit in the binary mirror
    And 2 chips are lit in "chips1"
    When I paint pixel 0 in the grid
    And I paint pixel 1 in the grid
    And I paint pixel 2 in the grid
    And I paint pixel 3 in the grid
    And I paint pixel 4 in the grid
    Then 0 pixels are lit in the binary mirror
    And 3 chips are lit in "chips1"
    And discovery 1 is complete

  Scenario: Discovery 2 — explore 1, 2 and 3-bit depth via the swatches
    When I open discovery 2
    Then the element "#shadeCount2" reads "2"
    When I click swatch 1
    Then the element "#previewCode2" reads "1"
    And 1 chips are lit in "chips2"
    When I set the depth slider to 2
    Then the element "#shadeCount2" reads "4"
    When I click swatch 3
    Then the element "#previewCode2" reads "11"
    And 2 chips are lit in "chips2"
    When I set the depth slider to 3
    Then the element "#shadeCount2" reads "8"
    When I click swatch 7
    Then the element "#previewCode2" reads "111"
    And 3 chips are lit in "chips2"
    And discovery 2 is complete

  Scenario Outline: Discovery 3 — each density reports its own file size
    When I open discovery 3
    And I select resolution "<density>"
    Then the element "#resSize3" reads "<size>"

    Examples:
      | density | size    |
      | 8×8     | 64 bits |
      | 4×4     | 16 bits |
      | 2×2     | 4 bits  |
      | 1×1     | 1 bit   |

  Scenario: Discovery 3 — stepping through all four densities completes it
    When I open discovery 3
    And I select resolution "8×8"
    And I select resolution "4×4"
    And I select resolution "2×2"
    And I select resolution "1×1"
    Then 4 chips are lit in "chips3"
    And discovery 3 is complete

  Scenario: Discovery 4 — a handful of samples then most of them
    When I open discovery 4
    And I tap sample point 0
    And I tap sample point 1
    Then the element "#sampleCount4" reads "2"
    And 1 chips are lit in "chips4"
    When I tap sample point 2
    And I tap sample point 3
    And I tap sample point 4
    And I tap sample point 5
    And I tap sample point 6
    And I tap sample point 7
    And I tap sample point 8
    And I tap sample point 9
    And I tap sample point 10
    Then the element "#sampleCount4" reads "11"
    And 2 chips are lit in "chips4"
    And discovery 4 is complete

  Scenario: Discovery 5 — one word from each group fills the sentence
    When I open discovery 5
    And I pick word 0 from group 1
    Then blank 1 reads "higher"
    And discovery 5 is not complete
    When I pick word 1 from group 2
    Then blank 2 reads "larger"
    And discovery 5 is complete

  Scenario: Discovery 5 — only one word per group can be selected at a time
    When I open discovery 5
    And I pick word 0 from group 1
    And I pick word 2 from group 1
    Then group 1 has exactly 1 selected words
    And blank 1 reads "clearer"

  @visual
  Scenario: Visual baseline
    Then the module matches its visual baseline
