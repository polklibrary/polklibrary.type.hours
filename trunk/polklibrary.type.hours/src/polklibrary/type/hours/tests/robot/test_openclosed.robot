# ============================================================================
# DEXTERITY ROBOT TESTS
# ============================================================================
#
# Run this robot test stand-alone:
#
#  $ bin/test -s polklibrary.type.hours -t test_openclosed.robot --all
#
# Run this robot test with robot server (which is faster):
#
# 1) Start robot server:
#
# $ bin/robot-server --reload-path src polklibrary.type.hours.testing.POLKLIBRARY_TYPE_HOURS_ACCEPTANCE_TESTING
#
# 2) Run robot tests:
#
# $ bin/robot src/plonetraining/testing/tests/robot/test_openclosed.robot
#
# See the http://docs.plone.org for further details (search for robot
# framework).
#
# ============================================================================

*** Settings *****************************************************************

Resource  plone/app/robotframework/selenium.robot
Resource  plone/app/robotframework/keywords.robot

Library  Remote  ${PLONE_URL}/RobotRemote

Test Setup  Open test browser
Test Teardown  Close all browsers


*** Test Cases ***************************************************************

Scenario: As a site administrator I can add a OpenClosed
  Given a logged-in site administrator
    and an add openclosed form
   When I type 'My OpenClosed' into the title field
    and I submit the form
   Then a openclosed with the title 'My OpenClosed' has been created

Scenario: As a site administrator I can view a OpenClosed
  Given a logged-in site administrator
    and a openclosed 'My OpenClosed'
   When I go to the openclosed view
   Then I can see the openclosed title 'My OpenClosed'


*** Keywords *****************************************************************

# --- Given ------------------------------------------------------------------

a logged-in site administrator
  Enable autologin as  Site Administrator

an add openclosed form
  Go To  ${PLONE_URL}/++add++OpenClosed

a openclosed 'My OpenClosed'
  Create content  type=OpenClosed  id=my-openclosed  title=My OpenClosed


# --- WHEN -------------------------------------------------------------------

I type '${title}' into the title field
  Input Text  name=form.widgets.title  ${title}

I submit the form
  Click Button  Save

I go to the openclosed view
  Go To  ${PLONE_URL}/my-openclosed
  Wait until page contains  Site Map


# --- THEN -------------------------------------------------------------------

a openclosed with the title '${title}' has been created
  Wait until page contains  Site Map
  Page should contain  ${title}
  Page should contain  Item created

I can see the openclosed title '${title}'
  Wait until page contains  Site Map
  Page should contain  ${title}
