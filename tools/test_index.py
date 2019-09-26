from base_needle_test import BaseNeedleTest

class TestIndex(BaseNeedleTest):
    @classmethod
    def setUpClass(cls):
        super(BaseNeedleTest, cls).setUp(cls)

    def test_nav(self):
        self.driver.get(self._base_url)
        self.assertScreenshot("#nav", "nav")

    @classmethod
    def tearDownClass(cls):
        cls.tearDown(cls)

if __name__ == '__main__':
    unittest.main()
