# -*- coding: utf-8 -*-
"""Setup tests for this package."""
from polklibrary.type.hours.testing import POLKLIBRARY_TYPE_HOURS_INTEGRATION_TESTING  # noqa
from plone import api

import unittest


class TestSetup(unittest.TestCase):
    """Test that polklibrary.type.hours is properly installed."""

    layer = POLKLIBRARY_TYPE_HOURS_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')

    def test_product_installed(self):
        """Test if polklibrary.type.hours is installed."""
        self.assertTrue(self.installer.isProductInstalled(
            'polklibrary.type.hours'))

    def test_browserlayer(self):
        """Test that IPolklibraryTypeHoursLayer is registered."""
        from polklibrary.type.hours.interfaces import (
            IPolklibraryTypeHoursLayer)
        from plone.browserlayer import utils
        self.assertIn(IPolklibraryTypeHoursLayer, utils.registered_layers())


class TestUninstall(unittest.TestCase):

    layer = POLKLIBRARY_TYPE_HOURS_INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')
        self.installer.uninstallProducts(['polklibrary.type.hours'])

    def test_product_uninstalled(self):
        """Test if polklibrary.type.hours is cleanly uninstalled."""
        self.assertFalse(self.installer.isProductInstalled(
            'polklibrary.type.hours'))

    def test_browserlayer_removed(self):
        """Test that IPolklibraryTypeHoursLayer is removed."""
        from polklibrary.type.hours.interfaces import IPolklibraryTypeHoursLayer
        from plone.browserlayer import utils
        self.assertNotIn(IPolklibraryTypeHoursLayer, utils.registered_layers())
