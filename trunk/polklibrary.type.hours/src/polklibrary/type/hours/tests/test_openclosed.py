# -*- coding: utf-8 -*-
from plone.app.testing import TEST_USER_ID
from zope.component import queryUtility
from zope.component import createObject
from plone.app.testing import setRoles
from plone.dexterity.interfaces import IDexterityFTI
from plone import api

from polklibrary.type.hours.testing import POLKLIBRARY_TYPE_HOURS_INTEGRATION_TESTING  # noqa
from polklibrary.type.hours.interfaces import IOpenClosed

import unittest2 as unittest


class OpenClosedIntegrationTest(unittest.TestCase):

    layer = POLKLIBRARY_TYPE_HOURS_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        setRoles(self.portal, TEST_USER_ID, ['Manager'])
        self.installer = api.portal.get_tool('portal_quickinstaller')

    def test_schema(self):
        fti = queryUtility(IDexterityFTI, name='OpenClosed')
        schema = fti.lookupSchema()
        self.assertEqual(IOpenClosed, schema)

    def test_fti(self):
        fti = queryUtility(IDexterityFTI, name='OpenClosed')
        self.assertTrue(fti)

    def test_factory(self):
        fti = queryUtility(IDexterityFTI, name='OpenClosed')
        factory = fti.factory
        obj = createObject(factory)
        self.assertTrue(IOpenClosed.providedBy(obj))

    def test_adding(self):
        self.portal.invokeFactory('OpenClosed', 'OpenClosed')
        self.assertTrue(
            IOpenClosed.providedBy(self.portal['OpenClosed'])
        )
