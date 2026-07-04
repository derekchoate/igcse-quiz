Feature: Module 8 — Reading the Map
  Reading flowcharts: naming the five shapes, then walking a glowing token
  through charts to watch loops, branches, and stops.

  Background:
    Given I open the module "08-reading-the-map"
    Then the star count is 0

  Scenario: Discovery 1 — matching all five shapes to their jobs
    When I give shape 1 the job "Start / stop"
    And I give shape 2 the job "Data in or out"
    And I give shape 3 the job "A step"
    And I give shape 4 the job "A yes/no question"
    And I give shape 5 the job "The order to follow"
    Then discovery 1 is complete
    And the star count is 1

  Scenario: Discovery 2 — walking the token through the loop reaches Stop
    When I open discovery 2
    And I step the token 20 times in "walk2"
    Then the walk "walk2" has reached Stop
    And discovery 2 is complete

  Scenario: Discovery 3 — feeding 7 drives the chart to Stop
    When I open discovery 3
    And I step the token 2 times in "walk3"
    Then the input row in "walk3" is showing
    When I feed 7 into "walk3"
    And I step the token 3 times in "walk3"
    Then discovery 3 is complete

  Scenario: Discovery 4 — fitting the two consistent pieces snaps the chart
    When I open discovery 4
    And I fit piece "dec_pos" into repair slot 1
    And I fit piece "out_notpos" into repair slot 2
    Then 2 repair slots in "repair4" are snapped
    And discovery 4 is complete

  Scenario: Discovery 5 — walking the doubling loop to Stop
    When I open discovery 5
    And I step the token 20 times in "walk5"
    Then discovery 5 is complete

  @visual
  Scenario: Visual baseline
    Then the module matches its visual baseline
