Feature: Module 6 — How Big Is a Song?
  File sizes on the 1024-based ladder: climbing units, working out a picture
  and a sound, the squeeze lever, and sorting lossless vs lossy.

  Background:
    Given I open the module "06-how-big-is-a-song"
    Then the star count is 0

  Scenario Outline: Discovery 1 — the ladder shows each unit's true 1024-based size
    When I climb the ladder to "<unit>"
    Then the element "#rungBytes1" reads "<size>"

    Examples:
      | unit | size                        |
      | byte | 1 byte                      |
      | KiB  | 1,024 bytes                 |
      | GiB  | 1,073,741,824 bytes         |
      | PiB  | 1,125,899,906,842,624 bytes |

  Scenario: Discovery 1 — climbing byte, KiB, GiB and PiB completes it
    When I climb the ladder to "byte"
    And I climb the ladder to "KiB"
    And I climb the ladder to "GiB"
    And I climb the ladder to "PiB"
    Then 4 chips are lit in "chips1"
    And discovery 1 is complete

  Scenario: Discovery 2 — the image-size calculation reaches 64, 1024 and 3072 bytes
    When I open discovery 2
    Then the element "#pixelCount2" reads "64"
    And the element "#fileBytes2" reads "8 bytes"
    When I click "#depthBtn2"
    Then the element "#fileBytes2" reads "64 bytes"
    When I click "#widthBtn2" 2 times
    And I click "#heightBtn2" 2 times
    Then the element "#pixelCount2" reads "1,024"
    And the element "#fileBytes2" reads "1,024 bytes"
    When I click "#depthBtn2"
    Then the element "#fileBytes2" reads "3,072 bytes"
    And 3 chips are lit in "chips2"
    And discovery 2 is complete

  Scenario: Discovery 3 — the sound-size calculation reaches 8000, 32000 and 176000 bytes
    When I open discovery 3
    Then the element "#fileBytes3" reads "8,000 bytes"
    When I click "#rateBtn3" 3 times
    Then the element "#fileBytes3" reads "8,000 bytes"
    And 1 chips are lit in "chips3"
    When I click "#resBtn3"
    And I click "#rateBtn3"
    Then the element "#fileBytes3" reads "32,000 bytes"
    And 2 chips are lit in "chips3"
    When I click "#rateBtn3"
    And I click "#secBtn3"
    Then the element "#fileBytes3" reads "176,000 bytes"
    And 3 chips are lit in "chips3"
    And discovery 3 is complete

  Scenario: Discovery 4 — squeezing stripes shrinks the tally and noise grows it
    When I open discovery 4
    And I click "#squeezeToggle4"
    And I click "#loadStripes4"
    Then the element "#tally4" contains "4 runs = 8 values"
    And the element "#tally4" has the class "shrank"
    And 1 chips are lit in "chips4"
    When I click "#loadNoise4"
    Then the element "#tally4" contains "16 runs = 32 values"
    And the element "#tally4" has the class "grew"
    And 2 chips are lit in "chips4"
    And discovery 4 is complete

  Scenario: Discovery 5 — a wrong bucket redirects warmly without locking
    When I open discovery 5
    And I sort file 3 as "Lossless"
    Then file 3 is not solved
    And the element "#toast" contains "Streaming a lossless copy"

  Scenario: Discovery 5 — sorting all five files correctly completes it
    When I open discovery 5
    And I sort file 1 as "Lossless"
    And I sort file 2 as "Lossless"
    And I sort file 3 as "Lossy"
    And I sort file 4 as "Lossy"
    And I sort file 5 as "Lossless"
    Then file 5 is solved
    And discovery 5 is complete

  @visual
  Scenario: Visual baseline
    Then the module matches its visual baseline
